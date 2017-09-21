import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html',
  styles: [`
  .main-navigation ul.main-navigation-list li.dropdown:hover ul{
    transition-delay:unset;
  }
  `]
})

export class HeaderNavigationComponent implements OnInit {
  allCategories: Category[] = [];
  uri = 'categories?view=tree&limit=';
  @Input() subcategoryLevel: number;
  @Output() hideHeaderNavigation: EventEmitter<any> = new EventEmitter();
  constructor(private categoryService: CategoriesService, private cacheService: CacheCustomService,
    private router: Router, public localize: LocalizeRouterService) {
  }

  ngOnInit() {
    if (!this.cacheService.cacheKeyExists('CatData')) {
      this.getCategoryTree();
    } else {
      this.allCategories = this.cacheService.getCachedData('CatData');
    }
  }

  getCategoryTree() {
    this.categoryService.getCategories(this.uri + this.subcategoryLevel).subscribe(response => {
      if (typeof (response) === 'object') {
        this.allCategories = response;
        this.cacheService.storeDataToCache(this.allCategories, 'CatData');
      }
    });
  }

  changeRoute(category, subCategory) {
    if (this.subcategoryLevel > 1) {
      const isNonLeaf = subCategory.hasOnlineSubCategories ? 'true' : 'false';
      this.cacheService.storeDataToCache(isNonLeaf, 'isNonLeaf');
    }
    this.hideHeaderNavigation.emit();
    this.router.navigate([this.localize.translateRoute('/category'), category.id, subCategory.id]);
    return false;
  }
}
