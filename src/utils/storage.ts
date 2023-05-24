import localForage from 'localforage';

export const storage = {
  eventLogs: [],
  eventLogsLoading: false,
  getEventLogs: async function getEventLogs() {
    const eventLogsLocalForage = (await localForage.getItem('eventLogs')) || [];
    const eventLogsData = this.eventLogs.length > eventLogsLocalForage.length ? this.eventLogs : eventLogsLocalForage;
    return eventLogsData;
  },
  setEventLogs: async function setEventLogs(data) {
    this.eventLogs = data;
    await localForage.setItem('eventLogs', data);
  },
  addEventLogs: async function setEventLogs(data) {
    const eventLogsData = await this.getEventLogs();
    eventLogsData.push(data);
    this.eventLogs = eventLogsData;
    await localForage.setItem('eventLogs', eventLogsData);
  },
  setEventLogsLoading: async function setEventLogsLoading(bool) {
    this.eventLogsLoading = bool;
  }
};
