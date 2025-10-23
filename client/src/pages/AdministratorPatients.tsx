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
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { patientService } from '@/services/patientService';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Patient {
  _id: string;
  userId: {
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
  createdAt: string;
  updatedAt: string;
}

const AdministratorPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
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

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getPatients();
      console.log('Fetched patients:', data);
      console.log('First patient structure:', data[0]);
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Failed to fetch patients: ' + ((error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPatient(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    form.setFieldsValue({
      ...patient,
      emergencyContactName: patient.emergencyContact?.name,
      emergencyContactRelationship: patient.emergencyContact?.relationship,
      emergencyContactPhone: patient.emergencyContact?.phone,
      insuranceProvider: patient.insuranceInfo?.provider,
      insurancePolicyNumber: patient.insuranceInfo?.policyNumber,
      insuranceGroupNumber: patient.insuranceInfo?.groupNumber,
    });
    setModalVisible(true);
  };

  const handleView = (patient: Patient) => {
    setEditingPatient(patient);
    form.setFieldsValue({
      ...patient,
      emergencyContactName: patient.emergencyContact?.name,
      emergencyContactRelationship: patient.emergencyContact?.relationship,
      emergencyContactPhone: patient.emergencyContact?.phone,
      insuranceProvider: patient.insuranceInfo?.provider,
      insurancePolicyNumber: patient.insuranceInfo?.policyNumber,
      insuranceGroupNumber: patient.insuranceInfo?.groupNumber,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await patientService.deletePatient(id);
      message.success('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      message.error('Failed to delete patient');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const patientData = {
        ...values,
        emergencyContact: {
          name: values.emergencyContactName,
          relationship: values.emergencyContactRelationship,
          phone: values.emergencyContactPhone,
        },
        insuranceInfo: {
          provider: values.insuranceProvider,
          policyNumber: values.insurancePolicyNumber,
          groupNumber: values.insuranceGroupNumber,
        },
      };

      if (editingPatient) {
        await patientService.updatePatient(editingPatient._id, patientData);
        message.success('Patient updated successfully');
      } else {
        await patientService.createPatient(patientData);
        message.success('Patient created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      fetchPatients();
    } catch (error) {
      message.error(editingPatient ? 'Failed to update patient' : 'Failed to create patient');
    }
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchText.toLowerCase();
    return (
      patient.userId?.firstName?.toLowerCase().includes(searchLower) ||
      patient.userId?.lastName?.toLowerCase().includes(searchLower) ||
      patient.userId?.email?.toLowerCase().includes(searchLower) ||
      patient.userId?.phone?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (record: Patient) => (
        <div>
          <div className="font-medium">
            {record.userId?.firstName} {record.userId?.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.userId?.email}</div>
        </div>
      ),
    },
    {
      title: 'Phone',
      key: 'phone',
      render: (record: Patient) => record.userId?.phone || 'N/A',
    },
    {
      title: 'Emergency Contact',
      key: 'emergencyContact',
      render: (record: Patient) => (
        <div>
          {record.emergencyContact ? (
            <>
              <div>{record.emergencyContact.name}</div>
              <div className="text-sm text-gray-500">
                {record.emergencyContact.relationship} - {record.emergencyContact.phone}
              </div>
            </>
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
    {
      title: 'Medical History',
      key: 'medicalHistory',
      render: (record: Patient) => (
        <div>
          {record.medicalHistory && record.medicalHistory.length > 0 ? (
            <div className="space-y-1">
              {record.medicalHistory.slice(0, 2).map((item, index) => (
                <Tag key={index} color="blue">{item}</Tag>
              ))}
              {record.medicalHistory.length > 2 && (
                <Tag color="default">+{record.medicalHistory.length - 2} more</Tag>
              )}
            </div>
          ) : (
            'None'
          )}
        </div>
      ),
    },
    {
      title: 'Allergies',
      key: 'allergies',
      render: (record: Patient) => (
        <div>
          {record.allergies && record.allergies.length > 0 ? (
            <div className="space-y-1">
              {record.allergies.slice(0, 2).map((allergy, index) => (
                <Tag key={index} color="red">{allergy}</Tag>
              ))}
              {record.allergies.length > 2 && (
                <Tag color="default">+{record.allergies.length - 2} more</Tag>
              )}
            </div>
          ) : (
            'None'
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Patient) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit Patient"
          />
          <Popconfirm
            title="Are you sure you want to delete this patient?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete Patient"
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
              Patient Management
            </Title>
            <Text type="secondary">
              Manage patient records, medical history, and contact information
            </Text>
          </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search patients..."
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
            Add New Patient
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} patients`,
          }}
          locale={{
            emptyText: 'No patients found'
          }}
        />
      </Card>

      <Modal
        title={editingPatient ? 'View/Edit Patient' : 'Add New Patient'}
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
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emergencyContactName"
                label="Emergency Contact Name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emergencyContactRelationship"
                label="Relationship"
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
              >
                <Input />
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
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="insurancePolicyNumber"
                label="Policy Number"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="insuranceGroupNumber"
                label="Group Number"
              >
                <Input />
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

          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalVisible(false)}>
              Cancel
            </Button>
            {editingPatient && (
              <Button type="primary" htmlType="submit">
                Update Patient
              </Button>
            )}
            {!editingPatient && (
              <Button type="primary" htmlType="submit">
                Create Patient
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

export default AdministratorPatients;
