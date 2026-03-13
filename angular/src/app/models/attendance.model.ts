export interface AttendanceRecord {
  id: string;
  checkInUTC: string;
  checkOutUTC?: string;
  checkInLocal: string;
  checkOutLocal?: string;
  checkInLocation: { latitude: number; longitude: number };
  checkOutLocation?: { latitude: number; longitude: number };
}
