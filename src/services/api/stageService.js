import { getApperClient } from "@/services/apperClient";

export const stageService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('stage_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "color_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching stages:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('stage_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "color_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Stage not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching stage ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }
};