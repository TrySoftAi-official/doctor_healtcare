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
  Upload,
  Avatar
} from 'antd';
import { 
  SaveOutlined,
  UserOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { patientService } from '@/services/patientService';
import { uploadService } from '@/services/uploadService';
import { userService } from '@/services/userService';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import { useMobileDetection } from '@/hooks';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PatientProfile {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profileImage?: string;
    dateOfBirth?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  preferredLanguage?: string;
  notes?: string;
  bio?: string;
}

const PatientProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patientData, setPatientData] = useState<PatientProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isMobile } = useMobileDetection();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPatientProfile();
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

  const fetchPatientProfile = async () => {
    setLoading(true);
    try {
      const data = await patientService.getMyProfile();
      setPatientData(data);
      if (data.userId?.profileImage) {
        setProfileImage(data.userId.profileImage);
      }
      form.setFieldsValue({
        firstName: data.userId?.firstName || '',
        lastName: data.userId?.lastName || '',
        email: data.userId?.email || '',
        phone: data.userId?.phone || '',
        dateOfBirth: data.userId?.dateOfBirth || '',
        bio: data.bio || '',
        emergencyContactName: data.emergencyContact?.name || '',
        emergencyContactRelationship: data.emergencyContact?.relationship || '',
        emergencyContactPhone: data.emergencyContact?.phone || '',
        preferredLanguage: data.preferredLanguage || 'english',
        insuranceProvider: data.insuranceInfo?.provider || '',
        insurancePolicyNumber: data.insuranceInfo?.policyNumber || '',
        insuranceGroupNumber: data.insuranceInfo?.groupNumber || '',
        medicalHistory: data.medicalHistory?.join('\n') || '',
        allergies: data.allergies?.join('\n') || '',
        currentMedications: data.currentMedications?.join('\n') || '',
        notes: data.notes || '',
      });
    } catch (error) {
      message.error('Failed to load patient profile: ' + ((error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'));
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

      // Update patient profile with bio and emergency contact
      await patientService.updateMyProfile({
        bio: values.bio || '',
        emergencyContact: {
          name: values.emergencyContactName,
          relationship: values.emergencyContactRelationship,
          phone: values.emergencyContactPhone,
        },
        preferredLanguage: values.preferredLanguage,
        notes: values.notes || '',
      } as any);

      // Update insurance info
      if (values.insuranceProvider || values.insurancePolicyNumber || values.insuranceGroupNumber) {
        await patientService.updateInsuranceInfo({
          insuranceInfo: {
            provider: values.insuranceProvider || '',
            policyNumber: values.insurancePolicyNumber || '',
            groupNumber: values.insuranceGroupNumber || '',
            effectiveDate: new Date().toISOString(),
          },
        });
      }

      // Update medical history
      const medicalHistory = values.medicalHistory
        ? values.medicalHistory.split('\n').filter((item: string) => item.trim())
        : [];
      await patientService.updateMedicalHistory({ medicalHistory });

      // Update allergies
      const allergies = values.allergies
        ? values.allergies.split('\n').filter((item: string) => item.trim())
        : [];
      await patientService.updateAllergies({ allergies });

      // Update current medications
      const currentMedications = values.currentMedications
        ? values.currentMedications.split('\n').filter((item: string) => item.trim())
        : [];
      await patientService.updateCurrentMedications({ currentMedications });

      message.success('Profile updated successfully');
      fetchPatientProfile();
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
                Manage your personal information, medical history, and preferences
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

                <Divider>Bio</Divider>

                <Form.Item
                  name="bio"
                  label="Bio"
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter your bio"
                  />
                </Form.Item>

                <Divider>Emergency Contact Information</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="emergencyContactName"
                      label="Emergency Contact Name"
                      rules={[{ required: true, message: 'Please enter emergency contact name' }]}
                    >
                      <Input placeholder="Enter contact name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="emergencyContactRelationship"
                      label="Relationship"
                      rules={[{ required: true, message: 'Please select relationship' }]}
                    >
                      <Select placeholder="Select relationship">
                        <Option value="spouse">Spouse</Option>
                        <Option value="parent">Parent</Option>
                        <Option value="child">Child</Option>
                        <Option value="sibling">Sibling</Option>
                        <Option value="friend">Friend</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="emergencyContactPhone"
                      label="Emergency Contact Phone"
                      rules={[{ required: true, message: 'Please enter emergency contact phone' }]}
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="preferredLanguage"
                      label="Preferred Language"
                    >
                      <Select placeholder="Select language">
                        <Option value="english">English</Option>
                        <Option value="spanish">Spanish</Option>
                        <Option value="french">French</Option>
                        <Option value="german">German</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Insurance Information</Divider>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="insuranceProvider"
                      label="Insurance Provider"
                    >
                      <Input placeholder="Enter insurance provider" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="insurancePolicyNumber"
                      label="Policy Number"
                    >
                      <Input placeholder="Enter policy number" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="insuranceGroupNumber"
                      label="Group Number"
                    >
                      <Input placeholder="Enter group number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Medical Information</Divider>

                <Form.Item
                  name="medicalHistory"
                  label="Medical History"
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter medical history (one per line)"
                  />
                </Form.Item>

                <Form.Item
                  name="allergies"
                  label="Allergies"
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter allergies (one per line)"
                  />
                </Form.Item>

                <Form.Item
                  name="currentMedications"
                  label="Current Medications"
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter current medications (one per line)"
                  />
                </Form.Item>

                <Form.Item
                  name="notes"
                  label="Additional Notes"
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter any additional notes"
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

export default PatientProfile;

