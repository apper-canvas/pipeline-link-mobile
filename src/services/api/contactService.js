import { getApperClient } from "@/services/apperClient";

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "last_contact_date_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "last_contact_date_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Contact not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(contact) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          name_c: contact.name || "",
          email_c: contact.email || "",
          phone_c: contact.phone || "",
          company_c: contact.company || "",
          status_c: contact.status || "lead",
          tags_c: Array.isArray(contact.tags) ? contact.tags.join(",") : (contact.tags || ""),
          notes_c: contact.notes || "",
          last_contact_date_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contact(s):`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(data.name && { name_c: data.name }),
          ...(data.email && { email_c: data.email }),
          ...(data.phone && { phone_c: data.phone }),
          ...(data.company && { company_c: data.company }),
          ...(data.status && { status_c: data.status }),
          ...(data.tags && { tags_c: Array.isArray(data.tags) ? data.tags.join(",") : data.tags }),
          ...(data.notes !== undefined && { notes_c: data.notes }),
          ...(data.lastContactDate && { last_contact_date_c: data.lastContactDate })
        }]
      };

      const response = await apperClient.updateRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contact(s):`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete contact:`, JSON.stringify(failed));
          throw new Error("Failed to delete contact");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "last_contact_date_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "email_c", "operator": "Contains", "values": [query]},
                {"fieldName": "company_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};