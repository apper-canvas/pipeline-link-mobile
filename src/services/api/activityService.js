import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for contact ${contactId}:`, error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        where: [{"FieldName": "deal_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for deal ${dealId}:`, error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(activity) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          ...(activity.contactId && { contact_id_c: parseInt(activity.contactId) }),
          ...(activity.dealId && { deal_id_c: parseInt(activity.dealId) }),
          type_c: activity.type || "email",
          description_c: activity.description || "",
          timestamp_c: activity.timestamp || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activity(s):`, JSON.stringify(failed));
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getRecent(limit = 10) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: { limit, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error.message);
return [];
    }
  }
};