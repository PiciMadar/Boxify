import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Box } from '../../../interfaces/box';
import { Item } from '../../../interfaces/item';
import { BoxItem } from '../../../interfaces/boxItem';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    // Chart data
    itemsPerBoxData: any;
    itemsPerBoxOptions: any;
    categoryData: any;
    categoryOptions: any;
    weightFillData: any;
    weightFillOptions: any;

    // Stats
    totalBoxes: number = 0;
    totalItems: number = 0;
    totalBoxItems: number = 0;
    avgFillPercent: number = 0;

    // Raw data
    boxes: Box[] = [];
    items: Item[] = [];
    boxItems: BoxItem[] = [];

    platformId = inject(PLATFORM_ID);

    constructor(
        private cd: ChangeDetectorRef,
        private api: ApiService,
        private auth: AuthService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const userId = this.auth.loggedUser()?.id;
        if (!userId) return;

        forkJoin({
            boxes: this.api.selectByField('boxes', 'userId', 'eq', userId),
            items: this.api.selectByField('items', 'userId', 'eq', userId),
        }).subscribe({
            next: (res: any) => {
                this.boxes = res.boxes as Box[];
                this.items = res.items as Item[];
                this.totalBoxes = this.boxes.length;
                this.totalItems = this.items.length;

                // Now load box_items for each box
                if (this.boxes.length > 0) {
                    const boxItemRequests: { [key: string]: any } = {};
                    this.boxes.forEach(b => {
                        if (b.id) {
                            boxItemRequests[b.id] = this.api.selectByField('box_items', 'boxId', 'eq', b.id);
                        }
                    });

                    if (Object.keys(boxItemRequests).length > 0) {
                        forkJoin(boxItemRequests).subscribe({
                            next: (biRes: any) => {
                                // Flatten all box items
                                this.boxItems = [];
                                Object.values(biRes).forEach((arr: any) => {
                                    if (Array.isArray(arr)) {
                                        this.boxItems.push(...arr);
                                    }
                                });
                                this.totalBoxItems = this.boxItems.reduce((sum, bi) => sum + (bi.quantity || 1), 0);
                                this.buildCharts(biRes);
                            },
                            error: () => this.buildCharts({})
                        });
                    } else {
                        this.buildCharts({});
                    }
                } else {
                    this.buildCharts({});
                }
            },
            error: (err) => {
                console.error('Failed to load dashboard data', err);
            }
        });
    }

    buildCharts(boxItemsByBoxId: any) {
        if (!isPlatformBrowser(this.platformId)) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        // ── 1. Items per Box (bar chart) ──
        const boxNames = this.boxes.map(b => b.name);
        const itemCounts = this.boxes.map(b => {
            const arr = boxItemsByBoxId[b.id!] as BoxItem[] || [];
            return arr.reduce((sum: number, bi: BoxItem) => sum + (bi.quantity || 1), 0);
        });

        this.itemsPerBoxData = {
            labels: boxNames,
            datasets: [{
                label: 'Items in box',
                backgroundColor: '#2d81ff',
                borderColor: '#2d81ff',
                borderRadius: 6,
                data: itemCounts
            }]
        };

        this.itemsPerBoxOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: { labels: { color: textColor } }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary, font: { weight: 500 } },
                    grid: { color: surfaceBorder, drawBorder: false }
                },
                y: {
                    ticks: { color: textColorSecondary, stepSize: 1 },
                    grid: { color: surfaceBorder, drawBorder: false },
                    beginAtZero: true
                }
            }
        };

        // ── 2. Items by Category (doughnut chart) ──
        const categoryCounts: { [cat: string]: number } = {};
        this.items.forEach(it => {
            const cat = it.category || 'Uncategorized';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const categoryLabels = Object.keys(categoryCounts);
        const categoryValues = Object.values(categoryCounts);
        const chartColors = [
            '#2d81ff', '#ff6b6b', '#51cf66', '#fcc419', '#cc5de8',
            '#20c997', '#ff922b', '#748ffc', '#f06595', '#66d9e8'
        ];

        this.categoryData = {
            labels: categoryLabels,
            datasets: [{
                data: categoryValues,
                backgroundColor: chartColors.slice(0, categoryLabels.length),
                hoverBackgroundColor: chartColors.slice(0, categoryLabels.length).map(c => c + 'cc')
            }]
        };

        this.categoryOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor, usePointStyle: true },
                    position: 'bottom'
                }
            }
        };

        // ── 3. Box Weight Fill % (horizontal bar chart) ──
        const fillPercents = this.boxes.map(b => {
            const arr = boxItemsByBoxId[b.id!] as BoxItem[] || [];
            let totalWeight = 0;
            arr.forEach((bi: BoxItem) => {
                const item = this.items.find(it => it.id?.toString() === bi.itemId?.toString());
                if (item) {
                    totalWeight += (item.weightKg || 0) * (bi.quantity || 1);
                }
            });
            const maxW = b.maxWeightKg || 1;
            return Math.min(Math.round((totalWeight / maxW) * 100), 100);
        });

        this.avgFillPercent = fillPercents.length > 0
            ? Math.round(fillPercents.reduce((a, b) => a + b, 0) / fillPercents.length)
            : 0;

        this.weightFillData = {
            labels: boxNames,
            datasets: [{
                label: 'Weight fill %',
                backgroundColor: fillPercents.map(p => p >= 90 ? '#ff6b6b' : p >= 60 ? '#fcc419' : '#51cf66'),
                borderRadius: 6,
                data: fillPercents
            }]
        };

        this.weightFillOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: { labels: { color: textColor } }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder, drawBorder: false },
                    min: 0,
                    max: 100
                },
                y: {
                    ticks: { color: textColorSecondary, font: { weight: 500 } },
                    grid: { display: false }
                }
            }
        };

        this.cd.markForCheck();
    }
}
