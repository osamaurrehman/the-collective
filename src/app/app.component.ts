import { Component, OnInit } from '@angular/core';

import { HttpService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedUser;
  public userData;
  public forkData;
  filenames: any;
  public loading = false;

  constructor(
    private httpService: HttpService
  ) {

  }

  ngOnInit(): void {
    console.log(this.httpService.getUsers());
  }

  async getUserList() {
    this.userData = [];
    this.loading = false;
    const res = await this.httpService.getUserList(this.selectedUser)
    if(res) {
      this.userData = res;
      this.loading = true;
      this.userData.map((i) => {
        this.forkData = [];
        this.httpService.getForKList(i.id)
        .then((res) => {
          const list:any = res;
          if(list.length !== 0) {
            i.forkData = res;
            return i; 
          }
        });
      })
    }
  }
}
