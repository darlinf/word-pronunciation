import axios from "axios";

const apiUrl = "http://localhost:8081/";
//const apiUrl = "https://test-api-production.up.railway.app/";

export const wordService = {
  getWordByWord,
  editWord,
  createWord,
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

function editWord(id, param) {
  return axios
    .put(`${apiUrl}word/editWord/${id}`, param)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

function createWord(param) {
  return axios
    .post(`${apiUrl}word/createWord`, param)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
}
