import axiosInstance from "./axisInstance";

export interface Alert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  tanker: string;
  ts: string;
  description: string;
}

export interface AlertFilters {
  severity?: string;
  startDate?: string;
  endDate?: string;
}

export const alertsService = {
  async getAlerts(filters: AlertFilters = {}): Promise<Alert[]> {
    const response = await axiosInstance.get('/alerts/getall', { params: filters });
    return response.data.data;
  },

  async sendAlertEmail(alertId: string): Promise<void> {
    await axiosInstance.post(`/alerts/${alertId}/email`);
  },
};