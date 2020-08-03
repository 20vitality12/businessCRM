import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart} from "chart.js"
import {tick} from "@angular/core/testing";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true
  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain.toFixed(1))

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order.toFixed(0))

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            callback: function (value) {
              if (Math.floor(value) === value) {
                return value;
              }
            }
          }
        }]

      }
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}


