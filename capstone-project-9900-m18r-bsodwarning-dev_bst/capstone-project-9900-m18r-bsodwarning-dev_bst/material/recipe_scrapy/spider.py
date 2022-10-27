# from recipe_scrapers import scrape_me
#
# # give the url as a string, it can be url from any site listed below
# scraper = scrape_me('https://www.kitchenstories.com/en/recipes/easy-pear-cake-with-spiced-whipped-cream-and-walnuts')
#
# print(scraper.title())
# print('======')
# print(scraper.total_time())
# print('======')
# print(scraper.yields())
# print('======')
# print(scraper.ingredients())
# print('======')
# print(scraper.instructions())  # or alternatively for results as a Python list: scraper.instructions_list()
# print('======')
# print(scraper.image())
# print('======')
# print(scraper.host())
# print('======')
# print(scraper.links())

import requests
from recipe_scrapers import scrape_html

# url = "https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/"
# url = "https://www.kitchenstories.com/en/recipes/easy-pear-cake-with-spiced-whipped-cream-and-walnuts"
# url = "https://www.kitchenstories.com/en/recipes/kung-pao-cauliflower"
for page_num in range(1,3):
    url = "https://www.acouplecooks.com/category/recipes/?_paged={}&_sort=date_asc".format(page_num)
    html = requests.get(url).content
    scraper = scrape_html(html=html, org_url=url)
    for idx, link in enumerate(scraper.links()):
        if idx == 90:
            url = link['href']
            html = requests.get(url).content
            scraper = scrape_html(html=html, org_url=url)
            print(scraper.title())


            # print(scraper.category())


            print(scraper.total_time())


            # print(scraper.cook_time())


            # print(scraper.prep_time())


            print(scraper.image())


            print(scraper.nutrients())


            print(scraper.ingredients())


            print(scraper.instructions_list())


            print(scraper.ratings())


            print(scraper.author())


            # print(scraper.cuisine())


            # print(scraper.description())


            print(scraper.canonical_url())

