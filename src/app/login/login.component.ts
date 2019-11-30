import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    oauthResponse: any;
    account: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.code) {
                this.getAccessToken(params.code);
            }
        });
    }

    getAccessToken(code: string) {

        const payload = new HttpParams()
            .append('grant_type', 'authorization_code')
            .append('code', code)
            .append('redirect_uri', 'http://localhost:4200/oauth/callback')
            .append('client_id', 'api');

        this.http.post('http://192.168.10.10:3000/oauth/access_token', payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).subscribe(response => {
            this.oauthResponse = response;
        });
    }

    goToLoginPage() {
        const params = [
            'response_type=code',
            'state=1234',
            'client_id=api',
            'scope=example',
            encodeURIComponent('redirect_uri=http://localhost:4200/oauth/callback'),
        ];

        window.location.href = 'http://192.168.10.10:3000/oauth/authenticate?' + params.join('&');
    }

    getProfile() {
        this.http.get('http://192.168.10.10:3000/account', {
            headers: {
                Authorization: 'Bearer ' + this.oauthResponse.access_token
            }
        }).subscribe(response => {
            this.account = response;
        });
    }

}
