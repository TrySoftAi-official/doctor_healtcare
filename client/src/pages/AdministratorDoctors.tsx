import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Popconfirm, 
  message, 
  Card, 
  Row, 
  Col, 
  Tag,
  Typography,
  Divider,
  Rate,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  StarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { doctorService } from '@/services/doctorService';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Doctor {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
  };
  specialty: string;
  licenseNumber?: string;
  experience?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  rating: number;
  totalReviews: number;
  bio?: string;
  consultationFee?: number;
  availability?: {
    monday: { start: string; end: string; isAvailable: boolean };
    tuesday: { start: string; end: string; isAvailable: boolean };
    wednesday: { start: string; end: string; isAvailable: boolean };
    thursday: { start: string; end: string; isAvailable: boolean };
    friday: { start: string; end: string; isAvailable: boolean };
    saturday: { start: string; end: string; isAvailable: boolean };
    sunday: { start: string; end: string; isAvailable: boolean };
  };
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdministratorDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (error) {
      message.error('Failed to fetch doctors: ' + ((error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'));
    } finally {
      setLoading(false);
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

  const handleCreate = () => {
    setEditingDoctor(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Removed handleEdit - admin can only view, not edit

  const handleView = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue({
      ...doctor,
      firstName: doctor.user?.firstName,
      lastName: doctor.user?.lastName,
      email: doctor.user?.email,
      phone: doctor.user?.phone,
      educationText: doctor.education?.join('\n'),
      certificationsText: doctor.certifications?.join('\n'),
      languagesText: doctor.languages?.join('\n'),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await doctorService.deleteDoctor(id);
      message.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      message.error('Failed to delete doctor');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const doctorData = {
        ...values,
        education: values.educationText?.split('\n').filter((item: string) => item.trim()),
        certifications: values.certificationsText?.split('\n').filter((item: string) => item.trim()),
        languages: values.languagesText?.split('\n').filter((item: string) => item.trim()),
      };

      // Remove text fields that are not part of the schema
      delete doctorData.educationText;
      delete doctorData.certificationsText;
      delete doctorData.languagesText;

      if (editingDoctor) {
        // For editing, we only update the doctor profile, not the user data
        const updateData = { ...doctorData };
        delete updateData.firstName;
        delete updateData.lastName;
        delete updateData.email;
        delete updateData.phone;
        
        await doctorService.updateDoctor(editingDoctor._id, updateData);
        message.success('Doctor updated successfully');
      } else {
        // For creating, we include user data
        await doctorService.createDoctor(doctorData);
        message.success('Doctor created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      fetchDoctors();
    } catch (error) {
      message.error(editingDoctor ? 'Failed to update doctor' : 'Failed to create doctor');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const searchLower = searchText.toLowerCase();
    return (
      doctor.user?.firstName?.toLowerCase().includes(searchLower) ||
      doctor.user?.lastName?.toLowerCase().includes(searchLower) ||
      doctor.user?.email?.toLowerCase().includes(searchLower) ||
      doctor.specialty?.toLowerCase().includes(searchLower) ||
      doctor.licenseNumber?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Doctor',
      key: 'doctor',
      render: (record: Doctor) => (
        <div>
          <div className="font-medium">
            {record.user?.firstName} {record.user?.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Specialty',
      key: 'specialty',
      render: (record: Doctor) => (
        <Tag color="blue">{record.specialty}</Tag>
      ),
    },
    {
      title: 'Experience',
      key: 'experience',
      render: (record: Doctor) => (
        <div>
          {record.experience ? `${record.experience} years` : 'N/A'}
        </div>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (record: Doctor) => (
        <div className="flex items-center gap-1">
          <Rate disabled value={record.rating} className="text-sm" />
          <span className="text-sm text-gray-500">({record.totalReviews})</span>
        </div>
      ),
    },
    {
      title: 'Consultation Fee',
      key: 'consultationFee',
      render: (record: Doctor) => (
        <div>
          {record.consultationFee ? `$${record.consultationFee}` : 'N/A'}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Doctor) => (
        <div className="flex items-center gap-2">
          <Switch 
            size="small" 
            checked={record.isAvailable} 
            disabled
          />
          <span className="text-sm">
            {record.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Doctor) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="View Details"
          />
          <Popconfirm
            title="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete Doctor"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
          <div className="mb-6">
            <Title level={2} className="flex items-center gap-2">
              <UserOutlined />
              Doctor Management
            </Title>
            <Text type="secondary">
              Manage doctor profiles, specialties, and availability
            </Text>
          </div>

          <Card>
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search doctors..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Add New Doctor
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={filteredDoctors}
              rowKey="_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} doctors`,
              }}
              locale={{
                emptyText: 'No doctors found'
              }}
            />
          </Card>

          <Modal
            title={editingDoctor ? 'View Doctor Details' : 'Add New Doctor'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={!!editingDoctor}
            >
              {!editingDoctor && (
                <>
                  <Divider>User Information</Divider>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter first name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter last name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please enter email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Phone"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

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
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="experience"
                    label="Experience (years)"
                  >
                    <Input type="number" min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="consultationFee"
                    label="Consultation Fee ($)"
                  >
                    <Input type="number" min={0} step={0.01} />
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

              <Divider>Professional Information</Divider>

              <Form.Item
                name="bio"
                label="Bio"
              >
                <TextArea
                  rows={3}
                  placeholder="Enter doctor's bio"
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

              <div className="flex justify-end gap-2">
                <Button onClick={() => setModalVisible(false)}>
                  {editingDoctor ? 'Close' : 'Cancel'}
                </Button>
                {!editingDoctor && (
                  <Button type="primary" htmlType="submit">
                    Create Doctor
                  </Button>
                )}
              </div>
            </Form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default AdministratorDoctors;
