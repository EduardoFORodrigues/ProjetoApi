import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  Paragraph,
  Modal,
  Portal,
  Button as PaperButton,
  HelperText,
} from "react-native-paper";
import theme from "../../../theme";
import { useAuth } from "@/context/AuthContext";

interface Student {
  _id: string | null;
  nome: string;
  email: string; // Add email field
  senha?: string; // Add optional senha field
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Function to fetch students (simulating an API)
const fetchStudents = async (token: string): Promise<Student[]> => {
  const apiRoute = apiUrl + "/api/users/aluno";

  const response = await axios.get(apiRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to delete a student
const deleteStudent = async (id: string, token: string): Promise<void> => {
  const apiRoute = apiUrl + "/api/users";

  await axios.delete(`${apiRoute}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to create a new student
const createStudent = async (
  newStudent: Omit<Student, "_id">,
  token: string
): Promise<Student> => {
  const apiRoute = apiUrl + "/api/users";

  const response = await axios.post(
    apiRoute,
    {
      nome: newStudent.nome,
      type: "aluno",
      senha: newStudent.senha,
      email: newStudent.email,
    },
    {}
  );
  return response.data;
};

// Function to edit an existing student
const editStudent = async (
  id: string,
  updatedStudent: Omit<Student, "_id">,
  token: string
): Promise<Student> => {
  const apiRoute = apiUrl + "/api/users";

  const response = await axios.put(
    `${apiRoute}/${id}`,
    { ...updatedStudent, type: "aluno" },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const StudentsManagement = () => {
  const { token } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newStudent, setNewStudent] = useState<Student>({
    _id: null,
    nome: "",

    email: "",
    senha: "", // Add senha to state
  });
  const [errors, setErrors] = useState<{
    nome?: string;

    email?: string;
    senha?: string; // Add senha validation error
  }>({});

  const queryClient = useQueryClient();

  // Query to fetch students
  const {
    data: students,
    isLoading,
    isError,
  } = useQuery<Student[]>(["students"], () => fetchStudents(token));

  // Mutation to delete a student
  const { mutate: removeStudent } = useMutation(
    (id: string) => deleteStudent(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["students"]);
      },
    }
  );

  // Mutation to create a new student
  const { mutate: addStudent } = useMutation(
    (newStudent: Omit<Student, "_id">) => createStudent(newStudent, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["students"]);
        setIsModalVisible(false); // Close the modal after creating the student
      },
    }
  );

  // Mutation to edit a student
  const { mutate: updateStudent } = useMutation(
    ({
      id,
      updatedStudent,
    }: {
      id: string;
      updatedStudent: Omit<Student, "_id">;
    }) => editStudent(id, updatedStudent, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["students"]);
        setIsModalVisible(false); // Close the modal after editing the student
      },
    }
  );

  // Handle creating a new student
  const handleCreateStudent = () => {
    const validationErrors: {
      nome?: string;

      email?: string;
      senha?: string;
    } = {};

    if (!newStudent.nome) validationErrors.nome = "O nome é obrigatório.";

    if (!newStudent.email) validationErrors.email = "O email é obrigatório."; // Email validation
    if (!newStudent.senha) validationErrors.senha = "A senha é obrigatória."; // senha validation

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addStudent(newStudent);
  };

  // Handle editing a student
  const handleEditStudent = () => {
    const validationErrors: {
      nome?: string;
      email?: string;
      senha?: string;
    } = {};

    if (!newStudent.nome) validationErrors.nome = "O nome é obrigatório.";
    if (!newStudent.email) validationErrors.email = "O email é obrigatório."; // Email validation

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (selectedStudentId) {
      updateStudent({
        id: selectedStudentId,
        updatedStudent: newStudent,
      });
    }
  };

  // Fill the modal fields with the selected student data
  const openEditModal = (student: Student) => {
    setSelectedStudentId(student._id);
    setNewStudent({
      _id: student._id,
      nome: student.nome,
      email: student.email,
      senha: undefined,
    });
    setIsModalVisible(true);
  };

  // Render the list of students
  const renderStudents = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>Erro ao carregar os students.</Text>
        </View>
      );
    }

    return students?.map((student) => (
      <Card key={student._id} style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{student.nome}</Text>
          <Text>Email: {student.email}</Text>
        </Card.Content>
        <Card.Actions>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeStudent(student._id)}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(student)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Alunos</Text>
      {renderStudents()}
      <PaperButton
        mode="contained"
        style={styles.createButton}
        onPress={() => {
          setSelectedStudentId(null);
          setNewStudent({
            _id: null,
            nome: "",
            email: "",
            senha: "", // Clear senha field
          });
          setIsModalVisible(true);
        }} // Exibir modal para criar novo student
      >
        Criar Novo Aluno
      </PaperButton>

      {/* Modal para criar ou editar um student */}
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedStudentId ? "Editar Aluno" : "Criar Novo Aluno"}
            </Text>
            <TextInput
              placeholder="Nome"
              value={newStudent.nome}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, nome: text })
              }
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.nome}>
              {errors.nome}
            </HelperText>

            <TextInput
              placeholder="Email"
              value={newStudent.email}
              keyboardType="email-address"
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, email: text })
              }
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
            {
              //se for editar aluno, não exibir campo de senha
              !selectedStudentId && (
                <>
                  <TextInput
                    placeholder="Senha"
                    secureTextEntry
                    value={newStudent.senha}
                    onChangeText={(text) =>
                      setNewStudent({ ...newStudent, senha: text })
                    }
                    style={styles.input}
                  />

                  <HelperText type="error" visible={!!errors.senha}>
                    {errors.senha}
                  </HelperText>
                </>
              )
            }

            <PaperButton
              mode="contained"
              style={styles.modalButton}
              onPress={
                selectedStudentId ? handleEditStudent : handleCreateStudent
              }
            >
              {selectedStudentId ? "Salvar alterações" : "Criar"}
            </PaperButton>
            <PaperButton
              mode="outlined"
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              Cancelar
            </PaperButton>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
    overflowY: "scroll",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardAuthor: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#777",
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 10,
  }, // Estilo da mensagem de carregando
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4A90E2", // cor para loading
    marginTop: 12,
  },

  // Estilo da mensagem de erro
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#e53e3e", // cor de erro
    marginTop: 12,
  },
});

export default StudentsManagement;
