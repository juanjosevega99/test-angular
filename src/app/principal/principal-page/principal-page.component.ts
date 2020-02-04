import { Component, OnInit } from "@angular/core";
import { element } from "protractor";
import { NgbModal, ModalDismissReasons, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { getLocaleEraNames } from '@angular/common';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-principal-page",
  templateUrl: "./principal-page.component.html",
  styleUrls: ["./principal-page.component.scss"]
})
export class PrincipalPageComponent implements OnInit {
  selectedDate: string = "";
  pedidos: any[] = [];
  hoursObj: any;
  tables: any[] = [];
  people: any[] = [];
  times: any[] = [];
  pedidoSelected:any;
  justTimes: any[] = [];
  reservas: any[] = [];
  peopleFreeSelected: 0;
  selectedTable: number = 0;
  selectedPeople: number = 0;
  selectedTime: string = "";
  closeResult: string;
  formattedTime: Date;
  textFunction:string = '';
  reservacionesFiltered: any[]= [];
  constructor(private modalService: NgbModal, private pedidoService: PedidosService, 
              private reservaService: ReservasService, private spinner : NgxSpinnerService) {}

  ngOnInit() {
  
    this.spinner.show()
    this.reservaService.getReservas().subscribe((reservas)=>{
      this.reservas = reservas;
      this.hours();
      console.log(this.reservas);
    })

    this.pedidoService.getPedidos().subscribe((pedidos)=>{
      this.pedidos= pedidos;
      this.spinner.hide();
      console.log(this.pedidos);
    })

    this.hoursObj = {a: "12:0",b: "12:30",c: "13:0",d: "13:30",e: "14:0",f: "14:30",
    g: "15:0",h: "15:30",i: "16:0",j: "16:30",k: "17:0",l: "17:30",m: "18:0",n: "18:30",o: "19:0",
    p: "19:30",q: "20:0",r:"20:30",s:"21:0",t:"21:30"
    };
  }

  onDateSelect($event) {
    console.log($event);
    this.selectedDate = $event.day + "/" + $event.month + "/" + $event.year;
    this.hours();
  }

  hours() {
    let itemsIds = ["1","2","3","4","5","6","7","8","9","10"
    ,"11","12","13","14","15","16","17","18","19","20","21",
    "22","23","24","25","26","27","28","29","30",
    "31","32","33","34","35","36","37","38","39","40"]

    itemsIds.forEach(element=>{
    document.getElementById(element).style.color='black';
    });    

    this.people = [];
    this.tables = [];
    this.times = [];
    this.justTimes = [];
    this.reservas.forEach(pedido => {
      var pedidoDate = pedido.dateReserva;
      if (
        pedidoDate.getDate() + "/" +
          (pedidoDate.getMonth() + 1) +"/" +
          pedidoDate.getFullYear() === this.selectedDate
      ) {
        this.times.push(pedido);
        this.people.push(pedido.people);
        this.justTimes.push(
          pedidoDate.getHours() + ":" + pedidoDate.getMinutes()
        );
        this.tables.push(pedido.table);
      }
    });

    this.reservas.forEach((reserva)=>{
      this.reservacionesFiltered.push(reserva.dateReserva.getDate()+"/"+(reserva.dateReserva.getMonth()+1)+ "/"+ reserva.dateReserva.getFullYear());
    })
    console.log(this.times);
    console.log(this.justTimes);
  }

  onClickTime(time: string,id) {
    let timesIds = ["11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
    this.selectedTime = time;
    console.log(time);
    timesIds.forEach(element=>{
      if(element == id){
        document.getElementById(id).style.color='red';    
    
    this.people = [];
    this.tables = [];
    this.reservas.forEach(reserva => {
      var reservaDate = reserva.dateReserva;
    //  console.log(reserva.getHours()+":"+reserva.getMinutes())
      if (
        reservaDate.getDate() +"/" +
          (reservaDate.getMonth() + 1) +"/" +
          reservaDate.getFullYear() ===
        this.selectedDate && time ===  reservaDate.getHours()+":"+reservaDate.getMinutes()
      ) {
        this.times.push(reserva);
        this.people.push(reserva.people);
        this.justTimes.push(reservaDate.getHours() + ":" + reservaDate.getMinutes());
        this.tables.push(reserva.table);
      }
    });

      }
      else{
        document.getElementById(element).style.color='black';
      }
    });
    console.log("mesas");
    console.log(this.tables)
  }

  onTableSelect(table: number,id) {
    this.selectedTable = table;
    let tableIds = ["1","2","3","4","5","6","7","8","9","10"];
    tableIds.forEach(element=>{
    if(element == id){
      document.getElementById(id).style.color='red';    
  
  this.people = [];
  this.tables = [];
  this.reservas.forEach(reserva => {
    var reservaDate = reserva.dateReserva;
  //  console.log(reserva.getHours()+":"+reserva.getMinutes())
    if (
      reservaDate.getDate() +"/" + (reservaDate.getMonth() + 1) +
        "/" + reservaDate.getFullYear() ===
      this.selectedDate && this.selectedTime ===  reservaDate.getHours()+":"+reservaDate.getMinutes() &&
      reserva.table === this.selectedTable
    ) {
      this.times.push(reserva);
      this.people.push(reserva.people);
      this.justTimes.push(reservaDate.getHours() + ":" + reservaDate.getMinutes());
      this.tables.push(reserva.table);
    }});
  }
    else{
      document.getElementById(element).style.color='black';
    }
  });



  }

  onPeopleSelect(people,id){
    this.selectedPeople = people;
    let peopleIds = ["31","32","33","34","35","36","37","38","39","40"];
    peopleIds.forEach((people)=>{
      if(people == id){
        document.getElementById(id).style.color="red";
      }
      else{
        document.getElementById(people).style.color="black";
      }
    })


    
  }

  ocupar(){
    this.spinner.show()
    let datesel = this.selectedDate.split('/');
    let time = this.selectedTime.split(':');
    this.reservas.push({dateReserva: new Date(parseInt( datesel[2]),(parseInt(datesel[1])-1),parseInt(datesel[0]), parseInt(time[0]), parseInt(time[1]), 0), people: this.selectedPeople, table: this.selectedTable, isShow:false});
    console.log('fecha'+ this.selectedDate)
    let obj = {dateReserva: new Date(parseInt( datesel[2]),(parseInt(datesel[1])-1),parseInt(datesel[0]), parseInt(time[0]), parseInt(time[1]), 0), people: this.selectedPeople, table: this.selectedTable, isShow:false};
    this.hours();
    this.reservaService.postReserva(obj).subscribe((message)=>
    {
      this.spinner.hide()
    });
   
    this.modalService.dismissAll();
    
  }


  liberar() {
    let index1 = -1;
    let pedidosel = this.reservas.filter((pedido, index) => {
      var pedidoDate = pedido.dateReserva;
      if (pedidoDate.getDate() +"/" + (pedidoDate.getMonth() + 1) +"/" +
          pedidoDate.getFullYear() === this.selectedDate &&
          pedidoDate.getHours() + ":" + pedidoDate.getMinutes() ===
          this.selectedTime && pedido.table === this.selectedTable
      ) {
        index1 = index;
      }
      return (
        pedidoDate.getDate() + "/" +(pedidoDate.getMonth() + 1) +"/" +
        pedidoDate.getFullYear() ===this.selectedDate &&
        pedidoDate.getHours() + ":" + pedidoDate.getMinutes() ===
        this.selectedTime && pedido.table === this.selectedTable
      );
    });
    console.log(index1);
    this.reservas.splice(index1, 1);
    this.hours();
    this.modalService.dismissAll();
    
  }

  openCheckbox(content,item){
    this.pedidoSelected= item;
    this.modalService
    .open(content, { ariaLabelledBy: "modal-basic-title" })
    .result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

  }

  open(content) {
     this.reservas.forEach((pedido, index) => {
      var pedidoDate = pedido.dateReserva;
      if (pedidoDate.getDate() +"/" +(pedidoDate.getMonth() + 1) +"/" +
          pedidoDate.getFullYear() === this.selectedDate &&
          pedidoDate.getHours() + ":" + pedidoDate.getMinutes() ===
          this.selectedTime &&
        pedido.table === this.selectedTable
      ) {
        this.peopleFreeSelected = pedido.people;
      }
    });

    let formattedTime = this.selectedTime.split(":");
    this.formattedTime = new Date(0,0,0,parseInt(formattedTime[0]),parseInt(formattedTime[1]));
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }



}
