import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography,
  Divider,
  message,
  Spin,
  Switch,
  Upload,
  Avatar
} from 'antd';
import { 
  SaveOutlined,
  UserOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { doctorService } from '@/services/doctorService';
import { uploadService } from '@/services/uploadService';
import { userService } from '@/services/userService';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import { useMobileDetection } from '@/hooks';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface DoctorProfile {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profileImage?: string;
    dateOfBirth?: string;
  };
  specialty: string;
  licenseNumber?: string;
  experience?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  bio?: string;
  consultationFee?: number;
  isAvailable: boolean;
}

const DoctorProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [doctorData, setDoctorData] = useState<DoctorProfile | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isMobile } = useMobileDetection();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDoctorProfile();
    fetchSpecialties();
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const uploadResult = await uploadService.uploadProfileImage(file);
      setProfileImage(uploadResult.url);
      await userService.updateProfile({ profileImage: uploadResult.url });
      message.success('Profile image updated successfully');
      return false;
    } catch (error) {
      message.error('Failed to upload profile image: ' + ((error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'));
      return false;
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const data = await doctorService.getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
    }
  };

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getMyProfile();
      setDoctorData(data);
      if (data.user?.profileImage) {
        setProfileImage(data.user.profileImage);
      }
      form.setFieldsValue({
        firstName: data.user?.firstName || '',
        lastName: data.user?.lastName || '',
        email: data.user?.email || '',
        phone: data.user?.phone || '',
        dateOfBirth: data.user?.dateOfBirth || '',
        specialty: data.specialty || '',
        licenseNumber: data.licenseNumber || '',
        experience: data.experience || 0,
        consultationFee: data.consultationFee || 0,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        bio: data.bio || '',
        educationText: data.education?.join('\n') || '',
        certificationsText: data.certifications?.join('\n') || '',
        languagesText: data.languages?.join('\n') || '',
      });
    } catch (error) {
      message.error('Failed to load doctor profile: ' + ((error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      // Update user basic info
      await userService.updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth || undefined,
      });

      // Update doctor profile
      const updateData = {
        specialty: values.specialty,
        licenseNumber: values.licenseNumber || '',
        experience: values.experience ? Number(values.experience) : 0,
        consultationFee: values.consultationFee ? Number(values.consultationFee) : 0,
        isAvailable: values.isAvailable !== undefined ? values.isAvailable : true,
        bio: values.bio || '',
        education: values.educationText
          ? values.educationText.split('\n').filter((item: string) => item.trim())
          : [],
        certifications: values.certificationsText
          ? values.certificationsText.split('\n').filter((item: string) => item.trim())
          : [],
        languages: values.languagesText
          ? values.languagesText.split('\n').filter((item: string) => item.trim())
          : [],
      };

      await doctorService.updateMyProfile(updateData);
      message.success('Profile updated successfully');
      fetchDoctorProfile();
    } catch (error) {
      message.error('Failed to update profile: ' + ((error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <div className="flex-shrink-0">
          <AdminSidebar 
            isOpen={isSidebarOpen}
            onToggle={handleMenuToggle}
            isMobile={isMobile}
          />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-shrink-0">
            <AdminHeader 
              onMenuToggle={handleMenuToggle}
              isMobile={isMobile}
            />
          </div>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 flex items-center justify-center">
            <Spin size="large" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0">
        <AdminSidebar 
          isOpen={isSidebarOpen}
          onToggle={handleMenuToggle}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <AdminHeader 
            onMenuToggle={handleMenuToggle}
            isMobile={isMobile}
          />
        </div>
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Title level={2} className="flex items-center gap-2">
                <UserOutlined />
                My Profile
              </Title>
              <p className="text-gray-600">
                Manage your professional information, specialties, and availability
              </p>
            </div>

            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Divider>Profile Picture</Divider>

                <Row gutter={16} className="mb-6">
                  <Col span={24}>
                    <div className="flex items-center gap-4">
                      <Avatar
                        size={120}
                        icon={<UserOutlined />}
                        src={profileImage}
                        className="bg-blue-500"
                      />
                      <Upload
                        maxCount={1}
                        beforeUpload={handleProfileImageUpload}
                        accept="image/*"
                      >
                        <Button 
                          icon={<CameraOutlined />} 
                          loading={uploadingImage}
                          type="primary"
                        >
                          Upload Photo
                        </Button>
                      </Upload>
                    </div>
                  </Col>
                </Row>

                <Divider>Personal Information</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                      <Input placeholder="Enter first name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Please enter last name' }]}
                    >
                      <Input placeholder="Enter last name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
                    >
                      <Input placeholder="Enter email" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="dateOfBirth"
                      label="Date of Birth"
                    >
                      <Input type="date" placeholder="Select date of birth" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Professional Information</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="specialty"
                      label="Specialty"
                      rules={[{ required: true, message: 'Please select a specialty' }]}
                    >
                      <Select placeholder="Select specialty">
                        {specialties.map(specialty => (
                          <Option key={specialty} value={specialty}>{specialty}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="licenseNumber"
                      label="License Number"
                    >
                      <Input placeholder="Enter license number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="experience"
                      label="Experience (years)"
                    >
                      <Input type="number" min={0} placeholder="Years of experience" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="consultationFee"
                      label="Consultation Fee ($)"
                    >
                      <Input type="number" min={0} step={0.01} placeholder="Fee amount" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="isAvailable"
                      label="Available"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Professional Details</Divider>

                <Form.Item
                  name="bio"
                  label="Bio"
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter your professional bio"
                  />
                </Form.Item>

                <Form.Item
                  name="educationText"
                  label="Education"
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter education (one per line)"
                  />
                </Form.Item>

                <Form.Item
                  name="certificationsText"
                  label="Certifications"
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter certifications (one per line)"
                  />
                </Form.Item>

                <Form.Item
                  name="languagesText"
                  label="Languages"
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter languages (one per line)"
                  />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-6">
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfile;

