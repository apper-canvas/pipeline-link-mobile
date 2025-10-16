import dealsData from "../mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async getByContactId(contactId) {
    await delay(250);
    return deals.filter(d => d.contactId === parseInt(contactId));
  },

  async create(deal) {
    await delay(400);
    const maxId = deals.length > 0 ? Math.max(...deals.map(d => d.Id)) : 0;
    const newDeal = {
      ...deal,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, data) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = { 
      ...deals[index], 
      ...data,
      updatedAt: new Date().toISOString()
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals.splice(index, 1);
    return true;
  },

  async updateStage(id, newStage) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = {
      ...deals[index],
      stage: newStage,
      updatedAt: new Date().toISOString()
    };
    return { ...deals[index] };
  }
};