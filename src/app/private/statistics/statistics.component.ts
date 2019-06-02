import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public earningsData;
  public loadingEarningsData: Boolean = false;
  public ordersData;
  public loadingOrdersData: Boolean = false;

  multi: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';
  timeline = false;
  autoScale = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    this.getOrders();
    this.getEarnings();
  }

  getOrders() {
    this.loadingEarningsData = true;
    this.statisticsService.getOrders().then((res) => {
      this.ordersData = [{
        'name': 'Pedidos',
        'series': res
      }];
      this.loadingEarningsData = false;
    }).catch((err) => this.loadingEarningsData = false);
  }

  getEarnings() {
    this.loadingOrdersData = true;
    this.statisticsService.getEarnings().then((res) => {
      this.earningsData = [{
        'name': 'Ingresos',
        'series': res
      }];
      this.loadingOrdersData = false;
    }).catch((err) => this.loadingOrdersData = false);
  }

}
