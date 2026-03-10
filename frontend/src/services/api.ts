import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getPeople = () => API.get("/people");

export const getEprs = (personId: string) =>
  API.get(`/epr?personId=${personId}`);

export const getEpr = (id: string) =>
  API.get(`/epr/${id}`);

export const createEpr = (data: any) =>
  API.post("/epr", data);

export const updateEpr = (id: string, data: any) =>
  API.patch(`/epr/${id}`, data);