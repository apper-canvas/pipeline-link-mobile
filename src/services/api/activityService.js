import activitiesData from "../mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  },

  async getByContactId(contactId) {
    await delay(250);
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getByDealId(dealId) {
    await delay(250);
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async create(activity) {
    await delay(400);
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      ...activity,
      Id: maxId + 1,
      timestamp: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async getRecent(limit = 10) {
    await delay(250);
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
};