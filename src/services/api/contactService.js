import contactsData from "../mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contact) {
    await delay(400);
    const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.Id)) : 0;
    const newContact = {
      ...contact,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, data) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts[index] = { ...contacts[index], ...data };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts.splice(index, 1);
    return true;
  },

  async search(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.company.toLowerCase().includes(lowerQuery)
    );
  }
};