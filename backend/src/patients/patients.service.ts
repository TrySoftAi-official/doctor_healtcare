import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    const patients = await this.patientModel.find().populate({
      path: 'userId',
      select: '-password'
    }).exec();
    
    return patients;
  }

  async findOne(id: string) {
    const patient = await this.patientModel.findById(id).populate({
      path: 'userId',
      select: '-password'
    }).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findByUserId(userId: string) {
    const patient = await this.patientModel.findOne({ userId }).populate({
      path: 'userId',
      select: '-password'
    }).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: string, updateData: any) {
    const patient = await this.patientModel.findByIdAndUpdate(id, updateData, { new: true }).populate({
      path: 'userId',
      select: '-password'
    }).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async updateMedicalHistory(id: string, medicalHistory: string[]) {
    return this.update(id, { medicalHistory });
  }

  async updateAllergies(id: string, allergies: string[]) {
    return this.update(id, { allergies });
  }

  async updateCurrentMedications(id: string, currentMedications: string[]) {
    return this.update(id, { currentMedications });
  }

  async updateInsuranceInfo(id: string, insuranceInfo: any) {
    return this.update(id, { insuranceInfo });
  }

  async create(createData: any) {
    const patient = new this.patientModel(createData);
    const savedPatient = await patient.save();
    return this.findOne(savedPatient._id.toString());
  }

  async remove(id: string) {
    const patient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return { message: 'Patient deleted successfully' };
  }
}
