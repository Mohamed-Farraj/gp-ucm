import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

// Define interfaces for better type safety
interface GenderData {
  total?: number;
  REJECTED?: number;
  UNDER_REVIEW?: number;
  ACCEPTED?: number;
}

interface ChartData {
  male?: GenderData;
  female?: GenderData;
}

@Component({
  selector: 'app-admin-landing-page',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './admin-landing-page.component.html',
  styleUrl: './admin-landing-page.component.scss'
})
export class AdminLandingPageComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() data: ChartData = {};

  // Add these properties
public statusPieOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      rtl: true
    },
    title: {
      display: false
    }
  }
};

get statusPieData(): ChartConfiguration<'pie'>['data'] {
  return {
    labels: ['المرفوض', 'تحت المراجعة', 'المقبول'],
    datasets: [{
      data: [
        (this.data?.male?.REJECTED || 0) + (this.data?.female?.REJECTED || 0),
        (this.data?.male?.UNDER_REVIEW || 0) + (this.data?.female?.UNDER_REVIEW || 0),
        (this.data?.male?.ACCEPTED || 0) + (this.data?.female?.ACCEPTED || 0)
      ],
      backgroundColor: [
        '#e74a3b', // Rejected
        '#f6c23e', // Under Review
        '#1cc88a'  // Accepted
      ],
      hoverOffset: 8
    }]
  };
}

  // Add these properties
public pieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      rtl: true // For right-to-left legend placement
    }
  }
};

get genderPieData(): ChartConfiguration<'pie'>['data'] {
  return {
    labels: ['ذكور', 'إناث'],
    datasets: [{
      data: [
        this.data?.male?.total ?? 0,
        this.data?.female?.total ?? 0
      ],
      backgroundColor: ['#0DCAF0', 'palevioletred'],
      hoverOffset: 4
    }]
  };
}

  // Bar Chart Configuration
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { ticks: { color: '#666' }, grid: { display: false } },
      y: { ticks: { color: '#666' }, grid: { display: false } }
    }
  };

  get genderChartData(): ChartConfiguration<'bar'>['data'] {
    return {
      labels: ['ذكور', 'اناث'],
      datasets: [{
        label: 'الطلبات',
        data: [
          this.data?.male?.total ?? 0,
          this.data?.female?.total ?? 0
        ],
        backgroundColor: ['#0DCAF0', 'palevioletred'],
        borderWidth: 0
      }]
    };
  }

  // Doughnut Chart Configuration
  public doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  get maleStatusData() {
    return {
      labels: ['الملرفوض', 'تحت المراجعه', 'المقبول'],
      datasets: [{
        data: [
          this.data?.male?.REJECTED ?? 0,
          this.data?.male?.UNDER_REVIEW ?? 0,
          this.data?.male?.ACCEPTED ?? 0
        ],
        backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a']
      }]
    };
  }

  get femaleStatusData() {
    return {
      labels: ['الملرفوض', 'تحت المراجعه', 'المقبول'],
      datasets: [{
        data: [
          this.data?.female?.REJECTED ?? 0,
          this.data?.female?.UNDER_REVIEW ?? 0,
          this.data?.female?.ACCEPTED ?? 0
        ],
        backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a']
      }]
    };
  }

  // Update chart when data changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.chart) {
      this.chart.update();
    }
  }
}