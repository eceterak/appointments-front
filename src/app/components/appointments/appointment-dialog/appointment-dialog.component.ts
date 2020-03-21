import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../../patients/patient.service';
import { HttpDataResponse } from 'src/app/interfaces/httpDataResponse.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from 'src/app/shared/utilities.service';
import { Service } from 'src/app/models/service.model';
import { DepartmentService } from '../../departments/department.service';
import { Appointment } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss']
})
export class AppointmentDialogComponent implements OnInit {

    appointmentForm: FormGroup;
    patients: Patient[];
    services: Service[];
    editMode: boolean = false;
    doctor = this.data.doctor;
    department = this.data.department;
    appointment: Appointment;
    getErrorMessage = UtilitiesService.getErrorMessage;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data,
        private dialogRef: MatDialogRef<AppointmentDialogComponent>,
        private appointmentService: AppointmentService,
        private patientService: PatientService,
        private departmentService: DepartmentService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        console.log(this.doctor);

        this.patientService.getSelectPatients().subscribe(
            (response: HttpDataResponse) => {
                this.patients = response.data;
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );

        this.departmentService.getServices(this.department.id).subscribe(
            (services: Service[]) => {
                this.services = services;
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );
        
        this.initForm();
    }

    initForm(): void {
        this.appointmentForm = new FormGroup({
            'patient': new FormControl(null, Validators.required),
            'service': new FormControl(null, Validators.required)
        });

        if(this.data.id) {
            this.editMode = true;

            this.appointmentService.getAppointment(this.data.id).subscribe(
                (appointment: Appointment) => {
                    this.appointment = appointment;

                    this.appointmentForm.get('patient').setValue(appointment.patient);
                    this.appointmentForm.get('service').setValue(appointment.service);
                }

            );
        }
    }

    onFormSubmit(): void {
        if(this.appointmentForm.valid) {
            if(this.editMode) {
                this.appointmentService.updateAppointment(this.data.id, this.data.slot, this.data.date, this.doctor, this.appointmentForm.value).subscribe(
                    (_) => {
                        this.snackBar.open('Appointment updated!', '', {
                            horizontalPosition: 'right',
                            politeness: 'assertive'
                        });

                        this.dialogRef.close();
                    },
                    (errorResponse: HttpErrorResponse) => {
                        //this.setErrors(errorResponse.error.errors);
                    }
                );
            } else {
                this.appointmentService.createAppointment(this.data.slot, this.data.date, this.doctor, this.appointmentForm.value).subscribe(
                    (_) => {
                        this.snackBar.open('Appointment booked!', '', {
                            horizontalPosition: 'right',
                            politeness: 'assertive'
                        });

                        this.dialogRef.close();
                    },
                    (errorResponse: HttpErrorResponse) => {
                        //this.setErrors(errorResponse.error.errors);
                    }
                );
            }
        } else {
            //this.setAlert();
        }
    }

    displayPatientName(patient: Patient): string {
        return patient && patient.name ? patient.name + ' ' + patient.surname : '';
    }

    displayServiceName(service: Patient): string {
        return service && service.name ? service.name : '';
    }

    onDeleteAppointment() {
        this.appointmentService.deleteAppointment(this.data.id, this.data.date, this.data.slot).subscribe(
            (_) => {
                this.snackBar.open('Appointment canceled', '', {
                    horizontalPosition: 'right'
                });
            },
            (errorResponse: HttpErrorResponse) => {
                console.log(errorResponse);
            }
        );
    }

    getDateTime() {
        const slots = ['8am', '9am', '10am', '11am', 'Noon', '1pm', '2pm', '3pm', '4pm'];

        return this.data.date.format('YYYY-MM-DD') + ' @ ' + slots[this.data.slot];
    }
}