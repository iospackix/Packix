import { Unh2021AppPage } from './app.po';

describe('unh2021-app App', () => {
  let page: Unh2021AppPage;

  beforeEach(() => {
    page = new Unh2021AppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
