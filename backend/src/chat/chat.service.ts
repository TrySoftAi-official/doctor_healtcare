import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { SendMessageDto, GetChatHistoryDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto): Promise<Message> {
    // Validate that sender and receiver exist
    const sender = await this.userModel.findById(senderId).exec();
    const receiver = await this.userModel.findById(sendMessageDto.receiverId).exec();

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    // Check if there's an appointment relationship between sender and receiver
    const hasAppointment = await this.checkAppointmentRelationship(senderId, sendMessageDto.receiverId);
    if (!hasAppointment) {
      throw new ForbiddenException('You can only chat with users you have appointments with');
    }

    const message = new this.messageModel({
      senderId,
      receiverId: sendMessageDto.receiverId,
      message: sendMessageDto.message,
      type: sendMessageDto.type || 'text',
      fileUrl: sendMessageDto.fileUrl,
      fileName: sendMessageDto.fileName,
      fileSize: sendMessageDto.fileSize,
    });

    return await message.save();
  }

  async getChatHistory(userId: string, getChatHistoryDto: GetChatHistoryDto) {
    const { participantId, page = 1, limit = 50 } = getChatHistoryDto;
    const skip = (page - 1) * limit;

    // Check if there's an appointment relationship
    const hasAppointment = await this.checkAppointmentRelationship(userId, participantId);
    if (!hasAppointment) {
      throw new ForbiddenException('You can only view chat history with users you have appointments with');
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: participantId },
          { senderId: participantId, receiverId: userId }
        ]
      })
      .populate('senderId', 'firstName lastName email profileImage')
      .populate('receiverId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.messageModel.countDocuments({
      $or: [
        { senderId: userId, receiverId: participantId },
        { senderId: participantId, receiverId: userId }
      ]
    });

    return {
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async markMessageAsRead(messageId: string, userId: string) {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only the receiver can mark as read
    if (message.receiverId.toString() !== userId) {
      throw new ForbiddenException('You can only mark your own received messages as read');
    }

    message.read = true;
    message.readAt = new Date();
    return await message.save();
  }

  async markAllMessagesAsRead(userId: string, participantId: string) {
    return await this.messageModel.updateMany(
      {
        senderId: participantId,
        receiverId: userId,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );
  }

  async getUnreadCount(userId: string) {
    return await this.messageModel.countDocuments({
      receiverId: userId,
      read: false
    });
  }

  async getChatParticipants(userId: string) {
    // First, get all users that the current user has appointments with
    const appointmentParticipants = await this.getAppointmentParticipants(userId);
    
    // Then, get chat history for existing conversations
    const chatParticipants = await this.messageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email',
          profileImage: '$user.profileImage',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      }
    ]);

    // Create a map of existing chat participants
    const chatMap = new Map();
    chatParticipants.forEach(participant => {
      chatMap.set(participant._id.toString(), participant);
    });

    // Merge appointment participants with chat participants
    const allParticipants = appointmentParticipants.map(participant => {
      const chatData = chatMap.get(participant._id.toString());
      if (chatData) {
        return {
          ...participant,
          lastMessage: chatData.lastMessage,
          lastMessageTime: chatData.lastMessageTime,
          unreadCount: chatData.unreadCount
        };
      }
      return {
        ...participant,
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0
      };
    });

    // Filter out the current user from participants
    const filteredParticipants = allParticipants.filter(participant => 
      participant._id.toString() !== userId
    );

    // Sort by last message time (most recent first), then by name
    const sortedParticipants = filteredParticipants.sort((a, b) => {
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      }
      if (a.lastMessageTime && !b.lastMessageTime) return -1;
      if (!a.lastMessageTime && b.lastMessageTime) return 1;
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });
    
    return sortedParticipants;
  }

  private async checkAppointmentRelationship(userId1: string, userId2: string): Promise<boolean> {
    // Check if there's an appointment between these users
    // First, get the patient and doctor records for both users
    const patient1 = await this.patientModel.findOne({ userId: new mongoose.Types.ObjectId(userId1) }).exec();
    const doctor1 = await this.doctorModel.findOne({ userId: new mongoose.Types.ObjectId(userId1) }).exec();
    const patient2 = await this.patientModel.findOne({ userId: new mongoose.Types.ObjectId(userId2) }).exec();
    const doctor2 = await this.doctorModel.findOne({ userId: new mongoose.Types.ObjectId(userId2) }).exec();

    // console.log('=== CHECKING APPOINTMENT RELATIONSHIP ===');
    // console.log('User1:', userId1, 'Patient1:', patient1?._id, 'Doctor1:', doctor1?._id);
    // console.log('User2:', userId2, 'Patient2:', patient2?._id, 'Doctor2:', doctor2?._id);

    // Check if both users have valid roles
    if (!patient1 && !doctor1) {
      // console.log('User1 is neither patient nor doctor');
      return false;
    }
    if (!patient2 && !doctor2) {
      // console.log('User2 is neither patient nor doctor');
      return false;
    }

    // If both users are the same type (both patients or both doctors), they can't chat
    if ((patient1 && patient2) || (doctor1 && doctor2)) {
      // console.log('Both users are the same type - cannot chat');
      return false;
    }

    // Check for appointments between them
    // Handle mixed data types (ObjectId vs string)
    let appointment;
    
    if (patient1 && doctor2) {
      // User1 is patient, User2 is doctor
      // console.log('Checking: Patient1 -> Doctor2');
      appointment = await this.appointmentModel.findOne({
        $and: [
          { patientId: patient1._id },
          { 
            $or: [
              { doctorId: doctor2._id },
              { doctorId: doctor2._id.toString() }
            ]
          }
        ]
      }).exec();
    } else if (doctor1 && patient2) {
      // User1 is doctor, User2 is patient
      // console.log('Checking: Doctor1 -> Patient2');
      appointment = await this.appointmentModel.findOne({
        $and: [
          { 
            $or: [
              { patientId: patient2._id },
              { patientId: patient2._id.toString() }
            ]
          },
          { doctorId: doctor1._id }
        ]
      }).exec();
    }

    // console.log('Found appointment:', !!appointment);
    // if (appointment) {
    //   console.log('Appointment details:', {
    //     id: appointment._id,
    //     patientId: appointment.patientId,
    //     doctorId: appointment.doctorId,
    //     status: appointment.status
    //   });
    // }

    // If no appointment found, check if we can allow chat based on roles
    if (!appointment) {
      // Allow doctors to chat with any patient (for now)
      if ((doctor1 && patient2) || (doctor2 && patient1)) {
        // console.log('Allowing chat between doctor and patient (no specific appointment required)');
        return true;
      }
    }

    return !!appointment;
  }


  private async getAppointmentParticipants(userId: string) {
    // Get all appointments for this user (as patient or doctor)
    const appointments = await this.appointmentModel.aggregate([
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      {
        $lookup: {
          from: 'doctors',
          let: { doctorId: '$doctorId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$doctorId'] },
                    { $eq: [{ $toString: '$_id' }, '$$doctorId'] }
                  ]
                }
              }
            }
          ],
          as: 'doctor'
        }
      },
      {
        $unwind: '$patient'
      },
      {
        $unwind: '$doctor'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'patient.userId',
          foreignField: '_id',
          as: 'patientUser'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor.userId',
          foreignField: '_id',
          as: 'doctorUser'
        }
      },
      {
        $unwind: '$patientUser'
      },
      {
        $unwind: '$doctorUser'
      },
      {
        $match: {
          $or: [
            { 'patientUser._id': new mongoose.Types.ObjectId(userId) },
            { 'doctorUser._id': new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $project: {
          _id: {
            $cond: [
              { $eq: ['$patientUser._id', new mongoose.Types.ObjectId(userId)] },
              '$doctorUser._id',
              '$patientUser._id'
            ]
          },
          firstName: {
            $cond: [
              { $eq: ['$patientUser._id', new mongoose.Types.ObjectId(userId)] },
              '$doctorUser.firstName',
              '$patientUser.firstName'
            ]
          },
          lastName: {
            $cond: [
              { $eq: ['$patientUser._id', new mongoose.Types.ObjectId(userId)] },
              '$doctorUser.lastName',
              '$patientUser.lastName'
            ]
          },
          email: {
            $cond: [
              { $eq: ['$patientUser._id', new mongoose.Types.ObjectId(userId)] },
              '$doctorUser.email',
              '$patientUser.email'
            ]
          },
          profileImage: {
            $cond: [
              { $eq: ['$patientUser._id', new mongoose.Types.ObjectId(userId)] },
              '$doctorUser.profileImage',
              '$patientUser.profileImage'
            ]
          },
          role: {
            $cond: [
              { $eq: ['$patientUser._id', new mongoose.Types.ObjectId(userId)] },
              'doctor',
              'patient'
            ]
          },
          appointmentDate: 1,
          status: 1
        }
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          email: { $first: '$email' },
          profileImage: { $first: '$profileImage' },
          role: { $first: '$role' },
          latestAppointment: { $max: '$appointmentDate' },
          appointmentCount: { $sum: 1 }
        }
      }
    ]);

    return appointments;
  }
}
