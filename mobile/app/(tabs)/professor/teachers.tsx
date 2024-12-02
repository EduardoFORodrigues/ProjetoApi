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

interface Teacher {
  _id: string | null;
  nome: string;
  email: string; // Add email field
  senha?: string; // Add optional senha field
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
// Function to fetch teachers (simulating an API)
const fetchTeachers = async (token: string): Promise<Teacher[]> => {
  const apiRoute = apiUrl + "/api/users/professor";

  const response = await axios.get(apiRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to delete a teacher
const deleteTeacher = async (id: string, token: string): Promise<void> => {
  const apiRoute = apiUrl + "/api/users";

  await axios.delete(`${apiRoute}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to create a new teacher
const createTeacher = async (
  newTeacher: Omit<Teacher, "_id">,
  token: string
): Promise<Teacher> => {
  const apiRoute = apiUrl + "/api/users";

  const response = await axios.post(
    apiRoute,
    {
      nome: newTeacher.nome,
      type: "professor",
      senha: newTeacher.senha,
      email: newTeacher.email,
    },
    {}
  );
  return response.data;
};

// Function to edit an existing teacher
const editTeacher = async (
  id: string,
  updatedTeacher: Omit<Teacher, "_id">,
  token: string
): Promise<Teacher> => {
  const apiRoute = apiUrl + "/api/users";

  const response = await axios.put(
    `${apiRoute}/${id}`,
    { ...updatedTeacher, type: "professor" },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const TeachersManagement = () => {
  const { token } = useAuth();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
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

  // Query to fetch teachers
  const {
    data: teachers,
    isLoading,
    isError,
  } = useQuery<Teacher[]>(["teachers"], () => fetchTeachers(token));

  // Mutation to delete a teacher
  const { mutate: removeTeacher } = useMutation(
    (id: string) => deleteTeacher(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teachers"]);
      },
    }
  );

  // Mutation to create a new teacher
  const { mutate: addTeacher } = useMutation(
    (newTeacher: Omit<Teacher, "_id">) => createTeacher(newTeacher, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teachers"]);
        setIsModalVisible(false); // Close the modal after creating the teacher
      },
    }
  );

  // Mutation to edit a teacher
  const { mutate: updateTeacher } = useMutation(
    ({
      id,
      updatedTeacher,
    }: {
      id: string;
      updatedTeacher: Omit<Teacher, "_id">;
    }) => editTeacher(id, updatedTeacher, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teachers"]);
        setIsModalVisible(false); // Close the modal after editing the teacher
      },
    }
  );

  // Handle creating a new teacher
  const handleCreateTeacher = () => {
    const validationErrors: {
      nome?: string;

      email?: string;
      senha?: string;
    } = {};

    if (!newTeacher.nome) validationErrors.nome = "O nome é obrigatório.";

    if (!newTeacher.email) validationErrors.email = "O email é obrigatório."; // Email validation
    if (!newTeacher.senha) validationErrors.senha = "A senha é obrigatória."; // senha validation

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addTeacher(newTeacher);
  };

  // Handle editing a teacher
  const handleEditTeacher = () => {
    const validationErrors: {
      nome?: string;
      email?: string;
      senha?: string;
    } = {};

    if (!newTeacher.nome) validationErrors.nome = "O nome é obrigatório.";
    if (!newTeacher.email) validationErrors.email = "O email é obrigatório."; // Email validation

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (selectedTeacherId) {
      updateTeacher({
        id: selectedTeacherId,
        updatedTeacher: newTeacher,
      });
    }
  };

  // Fill the modal fields with the selected teacher data
  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacherId(teacher._id);
    setNewTeacher({
      _id: teacher._id,
      nome: teacher.nome,
      email: teacher.email,
      senha: undefined,
    });
    setIsModalVisible(true);
  };

  // Render the list of teachers
  const renderTeachers = () => {
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
          <Text style={styles.errorText}>Erro ao carregar os teachers.</Text>
        </View>
      );
    }

    return teachers?.map((teacher) => (
      <Card key={teacher._id} style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{teacher.nome}</Text>
          <Text>Email: {teacher.email}</Text>
        </Card.Content>
        <Card.Actions>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeTeacher(teacher._id)}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(teacher)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Professores</Text>
      {renderTeachers()}
      <PaperButton
        mode="contained"
        style={styles.createButton}
        onPress={() => {
          setSelectedTeacherId(null);
          setNewTeacher({
            _id: null,
            nome: "",
            email: "",
            senha: "", // Clear senha field
          });
          setIsModalVisible(true);
        }} // Exibir modal para criar novo teacher
      >
        Criar Novo Professor
      </PaperButton>

      {/* Modal para criar ou editar um teacher */}
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedTeacherId ? "Editar Professor" : "Criar Novo Professor"}
            </Text>
            <TextInput
              placeholder="Nome"
              value={newTeacher.nome}
              onChangeText={(text) =>
                setNewTeacher({ ...newTeacher, nome: text })
              }
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.nome}>
              {errors.nome}
            </HelperText>

            <TextInput
              placeholder="Email"
              value={newTeacher.email}
              keyboardType="email-address"
              onChangeText={(text) =>
                setNewTeacher({ ...newTeacher, email: text })
              }
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
            {
              //se for editar professor, não exibir campo de senha
              !selectedTeacherId && (
                <>
                  <TextInput
                    placeholder="Senha"
                    secureTextEntry
                    value={newTeacher.senha}
                    onChangeText={(text) =>
                      setNewTeacher({ ...newTeacher, senha: text })
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
                selectedTeacherId ? handleEditTeacher : handleCreateTeacher
              }
            >
              {selectedTeacherId ? "Salvar alterações" : "Criar"}
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

export default TeachersManagement;
