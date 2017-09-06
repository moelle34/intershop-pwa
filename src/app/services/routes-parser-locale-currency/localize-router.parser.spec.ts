import { Injector } from '@angular/core';
import { LocalizeParser } from './localize-router.parser';
import { getTestBed, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { Location, CommonModule } from '@angular/common';
import {
  LocalizeRouterSettings,
  ALWAYS_SET_PREFIX
} from './localize-router.config';

class ManualParserLoader extends LocalizeParser {
  constructor(translate: TranslateService,
              location: Location,
              settings: LocalizeRouterSettings,
              langs: string[],
              localesCollection: any,
              prefix: string = 'ROUTES.',
              pattern: string = '{LANG}/{CURRENCY}') {
    super(translate, location, settings);
    this.langs = langs;
    this.localesCollection = localesCollection;
    this.prefix = prefix || '';
    this.pattern = pattern;
  }

  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      this.init(routes).then(resolve);
    });
  }
}

class FakeTranslateService {
  defLang: string;
  currentLang: string;

  browserLang = '';

  content: any = {
    'PREFIX.home': 'home_',
    'PREFIX.about': 'about_',
    'PREFIX.contact': 'contact_',
    'PREFIX.info': 'info_'
  };

  setDefaultLang(lang: string) {
    this.defLang = lang;
  }

  getDefaultLang() {
    return this.defLang;
  }

  use(lang: string) {
    this.currentLang = lang;
    return Observable.of(Object.keys(this.content).reduce((prev: any, key) => {
      prev[key] = this.content[key] + this.currentLang;
      return prev;
    }, {}));
  }

  get(input: string) {
    return Observable.of(this.content[input] ? this.content[input] + this.currentLang : input);
  }

  getBrowserLang() {
    return this.browserLang;
  }
}

class FakeLocation {
  path(): string {
    return '';
  }
}

describe('LocalizeParser', () => {
  let injector: Injector;
  let loader: ManualParserLoader;
  let translate: TranslateService;
  let location: Location;
  let settings: LocalizeRouterSettings;

  let routes: Routes;
  let locales: any;
  let langs: string[];
  const prefix = 'PREFIX.';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: TranslateService, useClass: FakeTranslateService },
        { provide: Location, useClass: FakeLocation },
        { provide: ALWAYS_SET_PREFIX, useValue: true },
        LocalizeRouterSettings
      ]
    });
    routes = [
      { path: '', redirectTo: 'some/path' },
      {
        path: 'some/path', children: [
        { path: '', redirectTo: 'nothing' },
        { path: 'else/:id', redirectTo: 'nothing/else' }
      ]
      }
    ];

    langs = ['en', 'de'];
    locales = [
      { 'lang': 'en', 'currency': 'USD', value: 'English', displayValue: 'en' },
      { 'lang': 'de', 'currency': 'EUR', value: 'German', displayValue: 'de' }
    ];

    injector = getTestBed();
    translate = injector.get(TranslateService);
    location = injector.get(Location);
    settings = injector.get(LocalizeRouterSettings);
    loader = new ManualParserLoader(translate, location, settings, langs, locales);
  });

  afterEach(() => {
    injector = undefined;
    translate = undefined;
    loader = undefined;
  });

  it('is defined', () => {
    expect(ManualParserLoader).toBeDefined();
    expect(loader).toBeDefined();
    expect(loader instanceof LocalizeParser).toEqual(true);
  });

  it('should set default language if not set', () => {
    expect(loader.langs).toEqual(['en', 'de']);
  });

  it('should extract language from url on getLocationLang', () => {
    loader = new ManualParserLoader(translate, location, settings, langs, locales, prefix);

    expect(loader.getLocationLang('/en/some/path/after')).toEqual('en');
    expect(loader.getLocationLang('de/some/path/after')).toEqual('de');
    expect(loader.getLocationLang('en')).toEqual('en');
    expect(loader.getLocationLang('en/')).toEqual('en');
    expect(loader.getLocationLang('/en')).toEqual('en');
    expect(loader.getLocationLang('/en/')).toEqual('en');
    expect(loader.getLocationLang('en?q=str')).toEqual('en');
    expect(loader.getLocationLang('en/?q=str')).toEqual('en');
    expect(loader.getLocationLang('/en?q=str')).toEqual('en');
    expect(loader.getLocationLang('/en/q=str')).toEqual('en');
  });

  it('should return null on getLocationLang if lang not found', () => {
    loader = new ManualParserLoader(translate, location, settings, locales, prefix);

    expect(loader.getLocationLang('/se/some/path/after')).toEqual(null);
    expect(loader.getLocationLang('rs/some/path/after')).toEqual(null);
    expect(loader.getLocationLang('')).toEqual(null);
    expect(loader.getLocationLang('/')).toEqual(null);
    expect(loader.getLocationLang('rs')).toEqual(null);
    expect(loader.getLocationLang('rs/')).toEqual(null);
    expect(loader.getLocationLang('/rs')).toEqual(null);
    expect(loader.getLocationLang('/rs/')).toEqual(null);
    expect(loader.getLocationLang('?q=str')).toEqual(null);
    expect(loader.getLocationLang('/?q=str')).toEqual(null);
    expect(loader.getLocationLang('rs?q=str')).toEqual(null);
    expect(loader.getLocationLang('rs/?q=str')).toEqual(null);
    expect(loader.getLocationLang('/rs?q=str')).toEqual(null);
    expect(loader.getLocationLang('/rs/q=str')).toEqual(null);
  });

  it('should call translateRoutes on init if languages passed', fakeAsync(() => {
    loader = new ManualParserLoader(translate, location, settings, langs, locales, prefix);
    spyOn(loader, 'translateRoutes').and.callThrough();

    loader.load([]);
    tick();
    expect(loader.translateRoutes).toHaveBeenCalled();
  }));

  it('should not call translateRoutes on init if no languages', fakeAsync(() => {
    loader = new ManualParserLoader(translate, location, settings, [], [], prefix);
    spyOn(loader, 'translateRoutes').and.callThrough();

    loader.load(routes);
    tick();
    expect(loader.translateRoutes).not.toHaveBeenCalled();
  }));
});
