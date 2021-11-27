import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SEOService } from './services/seo.service';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Postman';
  
  constructor (
    private readonly titleService: Title,
    private readonly seo: SEOService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    ) {}
  
  ngOnInit() {
    // initial state
    this.titleService.setTitle(this.title);
  
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      //here we can add getting params from routes like id etc., to set if needed some data to page with dynamic page
      mergeMap((route) => route.data)
    )
      .subscribe((event) => {
        this.seo.updateTitle(event['title']);
        this.seo.updateKeyWords(event['keywords']);
        //Updating Description tag dynamically with title
        this.seo.updateDescription(`${event['title']}: ${event['description']}`)
      });
  }
}
