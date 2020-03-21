import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CalendarData } from 'src/app/interfaces/calendarData.interface';
import { CalendarRow } from 'src/app/interfaces/calendarRow.interface';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Doctor } from 'src/app/models/doctor.model';
import { HttpDataResponse } from 'src/app/interfaces/httpDataResponse.interface';
import { Appointment } from 'src/app/models/appointment.model';
import { environment } from './../../../environments/environment';

@Injectable()

export class AppointmentService {
    calendarDataChanged = new Subject<CalendarData>();
    appointmentsChanged = new Subject<CalendarRow[]>();
    daysToDisplay: number = 5;
    appointmentsTable: CalendarRow[];

    constructor(private http: HttpClient) {}

    getAllAppointments(doctorId: number, date: moment.Moment): Observable<CalendarRow[]> {
        return this.http.get<HttpDataResponse>(environment.api + 'doctors/' + doctorId + '/appointments', {
            params: {
                date: date.format('YYYY-MM-DD')
            }
        }).pipe(
            map(response => {
                const appointments = response.data;

                let table = new Array(this.daysToDisplay);

                for(let i = 0; i < this.daysToDisplay; i++) {
                    const slots = new Array(9).fill(null);
                    const cDate = moment(date).add(i, 'd');
                    const isHoliday = cDate.day() != 0;

                    if(isHoliday) {
                        const t = cDate.format('YYYY-MM-DD');

                        if(appointments.hasOwnProperty(t)) {
                            for(let i = 0; i < 9; i++) {
                                const pos = appointments[t].findIndex(
                                    (appointmentEl: Appointment) => {
                                        return appointmentEl.slot == i;
                                    }
                                )
                                    
                                if(pos !== -1) {
                                    slots[i] = appointments[t][pos].id;
                                }
                            }
                        }
                    }

                    table[i] = new CalendarRow(cDate, slots, isHoliday);

                }

                return table;
            }),
            tap(response => {
                this.appointmentsTable = response;
            })
        );
    }

    getAppointment(id: number): Observable<Appointment> {
        return this.http.get<HttpDataResponse>(environment.api + 'appointments/' + id).pipe(
            map(response => {
                const args = response.data;
                
                return new Appointment(args.id, args.doctor, args.patient, args.service, args.slot, moment(args.date));
            })
        );
    }

    createAppointment(slot: number, date: moment.Moment, doctor: Doctor, data: any) {
        return this.http.post<HttpDataResponse>(environment.api + 'appointments', {
            doctor_id: doctor.id,
            slot: slot,
            date: date.format('YYYY-MM-DD'),
            service_id: data.service.id,
            patient_id: data.patient.id
        }).pipe(
            tap(response => {
                console.log(response);

                const pos = this.appointmentsTable.findIndex(
                    tableEl => {
                        return tableEl.date == date;
                    }
                );

                this.appointmentsTable[pos].slots[slot] = response.data.id;

                this.appointmentsChanged.next(this.appointmentsTable.slice());
            })
        );
    }

    updateAppointment(id: number, slot: number, date: moment.Moment, doctor: Doctor, data: any): Observable<HttpDataResponse> {
        return this.http.patch<HttpDataResponse>(environment.api + 'appointments/' + id, {
            doctor_id: doctor.id,
            slot: slot,
            date: date.format('YYYY-MM-DD'),
            service_id: data.service.id,
            patient_id: data.patient.id
        });
    }

    deleteAppointment(id: number, date: any, slot: number): Observable<any> {
        const pos = this.appointmentsTable.findIndex(
            tableEl => {
                return tableEl.date == date;
            }
        );

        this.appointmentsTable[pos].slots[slot] = null;

        return this.http.delete(environment.api + 'appointments/' + id);
    }
}