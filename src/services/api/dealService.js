import { getApperClient } from "@/services/apperClient";

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "expected_close_date_c"}},
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
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Deal not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching deals for contact ${contactId}:`, error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(deal) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          contact_id_c: parseInt(deal.contactId),
          title_c: deal.title || "",
          value_c: parseFloat(deal.value) || 0,
          stage_c: deal.stage || "discovery",
          probability_c: parseInt(deal.probability) || 0,
          expected_close_date_c: deal.expectedCloseDate || new Date().toISOString().split('T')[0],
          notes_c: deal.notes || ""
        }]
      };

      const response = await apperClient.createRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deal(s):`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(data.contactId && { contact_id_c: parseInt(data.contactId) }),
          ...(data.title && { title_c: data.title }),
          ...(data.value !== undefined && { value_c: parseFloat(data.value) }),
          ...(data.stage && { stage_c: data.stage }),
          ...(data.probability !== undefined && { probability_c: parseInt(data.probability) }),
          ...(data.expectedCloseDate && { expected_close_date_c: data.expectedCloseDate }),
          ...(data.notes !== undefined && { notes_c: data.notes })
        }]
      };

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deal(s):`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete deal:`, JSON.stringify(failed));
          throw new Error("Failed to delete deal");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          stage_c: newStage
        }]
      };

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update stage:`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};