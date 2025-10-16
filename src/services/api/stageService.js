import stagesData from "../mockData/stages.json";

let stages = [...stagesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const stageService = {
  async getAll() {
    await delay(200);
    return [...stages].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await delay(150);
    const stage = stages.find(s => s.Id === parseInt(id));
    if (!stage) {
      throw new Error("Stage not found");
    }
    return { ...stage };
  }
};