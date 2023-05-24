import localForage from 'localforage';

interface Storage {
  eventLogs: any[];
  eventLogsLoading: boolean;
  getEventLogs: any;
  setEventLogs: any;
  addEventLogs: any;
  setEventLogsLoading: any;
}

export const storage: Storage = {
  eventLogs: [],
  eventLogsLoading: false,
  async getEventLogs(): Promise<any[]> {
    const eventLogsLocalForage = (await localForage.getItem('eventLogs')) || [];
    const eventLogsData = this.eventLogs.length > eventLogsLocalForage.length ? this.eventLogs : eventLogsLocalForage;
    return eventLogsData;
  },
  async setEventLogs(data: any[]): Promise<void> {
    this.eventLogs = data;
    await localForage.setItem('eventLogs', data);
  },
  async addEventLogs(data: any): Promise<void> {
    const eventLogsData = await this.getEventLogs();
    eventLogsData.push(data);
    this.eventLogs = eventLogsData;
    await localForage.setItem('eventLogs', eventLogsData);
  },
  async setEventLogsLoading(bool: boolean): Promise<void> {
    this.eventLogsLoading = bool;
  }
};
