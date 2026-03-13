import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [NgIf],
  templateUrl: './verify-email-page.component.html',
  styleUrl: './verify-email-page.component.scss'
})
export class VerifyEmailPageComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'error';
      return;
    }

    this.http.get(`${environment.apiUrl}/auth/verify`, { params: { token } })
      .subscribe({
        next: () => this.status = 'success',
        error: () => this.status = 'error'
      });
  }
}
