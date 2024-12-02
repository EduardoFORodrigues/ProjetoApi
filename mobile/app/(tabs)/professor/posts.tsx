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

interface Post {
  _id: string;
  titulo: string;
  autor: string;
  descricao: string;
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
console.log(apiUrl);
// Function to fetch posts (simulating an API)
const fetchPosts = async (token: string): Promise<Post[]> => {
  const apiRoute = apiUrl + "/api/posts";
  const response = await axios.get(apiRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to delete a post
const deletePost = async (id: string, token: string): Promise<void> => {
  console.log(id);
  const apiRoute = apiUrl + "/api/posts";
  console.log(apiRoute);
  const response = await axios.delete(`${apiRoute}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
};

// Function to create a new post
const createPost = async (
  newPost: Omit<Post, "_id">,
  token: string
): Promise<Post> => {
  const apiRoute = apiUrl + "/api/posts";

  const response = await axios.post(apiRoute, newPost, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to edit an existing post
const editPost = async ({
  id,
  updatedPost,
  token,
}: {
  id: string;
  updatedPost: Omit<Post, "_id">;
  token: string;
}): Promise<Post> => {
  const apiRoute = apiUrl + "/api/posts";
  const response = await axios.put(`${apiRoute}/${id}`, updatedPost, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const PostsManagement = () => {
  const { token } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPost, setNewPost] = useState<Omit<Post, "_id">>({
    titulo: "",
    autor: "",
    descricao: "",
  });
  const [errors, setErrors] = useState<{
    titulo?: string;
    autor?: string;
    descricao?: string;
  }>({});

  const queryClient = useQueryClient();

  // Query to fetch posts
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>(["posts"], () => fetchPosts(token));

  // Mutation to delete a post
  const { mutate: removePost } = useMutation(
    (id: string) => deletePost(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  // Mutation to create a new post
  const { mutate: addPost } = useMutation(
    (newPost: Omit<Post, "_id">) => createPost(newPost, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        setIsModalVisible(false); // Close the modal after creating the post
      },
    }
  );

  // Mutation to edit a post
  const { mutate: updatePost } = useMutation(
    ({ id, updatedPost }: { id: string; updatedPost: Omit<Post, "_id"> }) =>
      editPost({ id, updatedPost, token }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        setIsModalVisible(false); // Close the modal after editing the post
      },
    }
  );

  // Handle creating a new post
  const handleCreatePost = () => {
    const validationErrors: {
      titulo?: string;
      autor?: string;
      descricao?: string;
    } = {};

    if (!newPost.titulo) validationErrors.titulo = "O título é obrigatório.";
    if (!newPost.autor) validationErrors.autor = "O autor é obrigatório.";
    if (!newPost.descricao)
      validationErrors.descricao = "A descrição é obrigatória.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addPost(newPost);
  };

  // Handle editing a post
  const handleEditPost = () => {
    const validationErrors: {
      titulo?: string;
      autor?: string;
      descricao?: string;
    } = {};

    if (!newPost.titulo) validationErrors.titulo = "O título é obrigatório.";
    if (!newPost.autor) validationErrors.autor = "O autor é obrigatório.";
    if (!newPost.descricao)
      validationErrors.descricao = "A descrição é obrigatória.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (selectedPostId) {
      updatePost({ id: selectedPostId, updatedPost: newPost });
    }
  };

  // Fill the modal fields with the selected post data
  const openEditModal = (post: Post) => {
    setSelectedPostId(post._id);
    setNewPost({
      _id: post._id,
      titulo: post.titulo,
      autor: post.autor,
      descricao: post.descricao,
    });
    setIsModalVisible(true);
  };

  // Render the list of posts
  const renderPosts = () => {
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
          <Text style={styles.errorText}>Erro ao carregar os posts.</Text>
        </View>
      );
    }

    return posts?.map((post) => (
      <Card key={post._id} style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{post.titulo}</Text>
          <Text style={styles.cardAuthor}>{post.autor}</Text>
          <Paragraph style={styles.cardDescription}>{post.descricao}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removePost(post._id)}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(post)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    ));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Posts</Text>
      {renderPosts()}
      <PaperButton
        mode="contained"
        style={styles.createButton}
        onPress={() => {
          setSelectedPostId(null);
          setNewPost({ _id: "", titulo: "", autor: "", descricao: "" });
          setIsModalVisible(true);
        }} // Exibir modal para criar novo post
      >
        Criar Novo Post
      </PaperButton>

      {/* Modal para criar ou editar um post */}
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedPostId ? "Editar Post" : "Criar Novo Post"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newPost.titulo}
              onChangeText={(text) => setNewPost({ ...newPost, titulo: text })}
            />
            <HelperText type="error" visible={!!errors.titulo}>
              {errors.titulo}
            </HelperText>

            <TextInput
              style={styles.input}
              placeholder="Autor"
              value={newPost.autor}
              onChangeText={(text) => setNewPost({ ...newPost, autor: text })}
            />
            <HelperText type="error" visible={!!errors.autor}>
              {errors.autor}
            </HelperText>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newPost.descricao}
              onChangeText={(text) =>
                setNewPost({ ...newPost, descricao: text })
              }
            />
            <HelperText type="error" visible={!!errors.descricao}>
              {errors.descricao}
            </HelperText>

            <View>
              <PaperButton onPress={() => setIsModalVisible(false)}>
                Cancelar
              </PaperButton>
              <PaperButton
                onPress={selectedPostId ? handleEditPost : handleCreatePost}
              >
                {selectedPostId ? "Salvar Alterações" : "Criar Post"}
              </PaperButton>
            </View>
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

export default PostsManagement;
