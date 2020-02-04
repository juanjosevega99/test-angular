import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/Pedido';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private httpclient: HttpClient ) { }

  getPedidos(): Observable<any[]>{
    return this.httpclient.get<Pedido[]>(environment.UrlBase+"pedidos").pipe(map((pedidos:any[]) => pedidos.map((pedido) => {   
      let obj = {codPedido: pedido.codPedido,
      cliente: pedido.cliente,
      modEntrega:pedido.modEntrega,
      valPedido: pedido.valPedido,
      dateReserva: new Date( pedido.dateReserva),
      dateEntrega: pedido.dateEntrega,
      cronometro: pedido.cronometro,
      statePedido: pedido.statePedido,
      val: pedido.val,
      color: pedido.color,
      type: pedido.type,
      items:pedido.items}
      return obj; })));
  }

}
