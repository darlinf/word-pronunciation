import axios from "axios";

const apiUrl = "http://localhost:8081/";

export const wordService = {
  getWordByWord,
  editWord,
  createSchema,
};

function getWordByWord(param) {
  console.log(`${apiUrl}word/getWordBy/${param}`);
  return axios
    .get(`${apiUrl}word/getWordBy/${param}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

function editWord(id) {
  return axios
    .put(`${apiUrl}word/editWord/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

function createSchema(param) {
  return axios
    .post(`${apiUrl}word/createWord`, param)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
}
