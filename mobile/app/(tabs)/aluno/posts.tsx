import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, Paragraph } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

// Definição do tipo Post
interface Post {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Função para buscar os posts (simulando uma API)
const fetchPosts = async (): Promise<Post[]> => {
  const apiRoute = apiUrl + "/api/posts";
  const response = await axios.get(apiRoute);
  return response.data;
};

const PostsList = () => {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>(["posts"], fetchPosts);
  const { logout } = useAuth();

  const handleLogout = () => {
    router.push("/");
    logout();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Bem-vindo às Postagens</Text>
      <Text style={styles.description}>
        Aqui você encontra uma lista de posts interessantes escritos por
        diversos autores. Explore, leia e aproveite!
      </Text>
    </View>
  );

  const renderContent = () => {
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

    if (!posts || posts.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Card key={item.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardAuthor}>Por: {item.autor}</Text>
              <Paragraph style={styles.cardDescription}>
                {item.descricao}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e5ec",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  header: {
    marginBottom: 16,
  },

  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: "#e53e3e",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    color: "#1f2937",
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
    marginBottom: 24,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  listContainer: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    marginBottom: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: "blur(10px)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 8,
  },

  cardAuthor: {
    fontSize: 15,
    color: "#4a5568",
    marginBottom: 12,
  },

  cardDescription: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 22,
  },

  loadingText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4A90E2",
    marginTop: 12,
  },

  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#e53e3e",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#718096",
    marginTop: 12,
  },
});

export default PostsList;
