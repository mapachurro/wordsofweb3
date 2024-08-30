# Welcome!

This repo is the backend for the `wordsofweb3.eth` glossary, from [Education DAO](https://educationdao.xyz/).

# wordsofweb3: Architecture

wordsofweb3 is a multilingual glossary app encompassing terms and explanations about crypto, web3, and decentralized web, in general, terms, concepts, and entities.

It is meant to be an intertextual experience for the reader: in every `term`'s definition, whenever there is a term or phrase that is *also* a `term` in the glossary in that language, there will be a hyperlink to that term.
Ideally, there will be a `breadcrumbs` element at the top of each entry page, tracking the user's journey through the interwoven terminology of this space.

## Design principles

This app is meant to be *for the ages*. The idea is that it *will never break*. It is designed to be deployed on decentralized storage networks, such as IPFS, which sometimes experience high latency; additionally, this technology should be accessible by the widest possible audience. 

For these reasons, at every point at which we can choose "how to do X", we should choose the dumbest, most low-tech way possible. 

This means that if you're installing an npm package, or importing a CDN, you might be doing it wrong.

## Implementation implications

Yes, this means custom scripting; but anyone that tells you that an npm package or open source project will require *less* maintenance than custom scripts that do what you want, well, wish them the best of luck with that.

### Creating the homepages

As a fully internationalized app, the site will actually have multiple potential versions of its homepage.

This will likely mean an `index.html`, which loads an `index.js`; that JS file will likely ensure:

- The user's browser language is detected
- An appropriate linguistic version of the site is loaded
    - Filling in the UI elements in a templated version of the homepage, using JQuery-like placeholders or tags, with UI strings from a .json file corresponding to the language in question
        - And falling back to the closest available locale (e.g. fall back to es-419 if es_HN is not available), or English if there is no support for a language family at all

#### The Navbar and language switching

There will be a language dropdown selector on the navbar of the site.
Changing the language in this dropdown will trigger a function in `index.js` which loads the corresponding language's strings -- **and changes the links on the page to URL paths or slugs which match that language**.
There will be no English-langauge slug elements when a user is experiencing the site in a language other than English.

### Creating the glossary entries

Similarly to the "template" format of the homepage, each `term`'s `entry page` will be generated **on the build side of the app; nothing will be created "generatively" on the reader's side.** 

There are two data inputs to these `entry pages`:

#### `ext-sync-terms.csv`:

This .csv file is something that will be imported, from time to time, with new or updated terms in one or more languages.
It currently houses a large number of locales; here is a sample of its structure and content:

```CSV
[en_US],[ar_AR],[zh-CN],[zh-TW],[nl_NL],[fr_FR],[de_DE],[el_GR],[ha-NG],[hi_IN],[hu_HU],[id_ID],[it_IT],[ja_JP],[ko_KR],[fa_IR],[ms_MY],[pcm-NG],[pl_PL],[pt_BR],[ro_RO],[ru_RU],[es-419],[tl_PH],[th_TH],[tr_TR],[uk_UA],[vi_VN]
51% Attack,هجوم 51٪,51%攻击,51%攻擊,51%-aanval,Attaque des 51 %,51% Attacke,Επίθεση του 51%,Tsarin 51%,51% अटैक,51%-os támadás,51% Attack,Attacco del 51%,51%攻撃,51% 공격,حمله 51 درصدی,Serangan 51%,Chop oga network,Atak 51%,Ataque de 51%,Atac 51%,Атака 51%,ataque de 51 %,51% Pag-atake,การโจมตี 51%,%51 Saldırısı,Атака 51%,Tấn công 51%
Account,حساب,账户,帳戶,account,Compte,Konto,Λογαριασμός,Asusu,Account,fiók,Akun,Account,アカウント,계정,حساب,Akaun,Akaunt,Konto,Conta,Cont,Счет,cuenta,Account,บัญชี,Hesap,Обліковий запис,Tài khoản
```

This .csv will be processed by a script, `generate-json.js`. For each locale, this script:
- Iterates through `./locales/<locale-code>` directories
    - In each directory, it looks for a file, `./locales/<locale-code>/<locale-code>.json`
        - If that file exists, it iterates through the rows of `ext-sync-terms.csv`, ensuring that:
            - There is a `term` object for each row of that locale (each word in that language), and that
            - There are no duplicate terms, such that building an HTML file from it would result in multiple HTML files located at the same URL path / slug.
            - Additionally, when this script creates a new term, it uses the following structure:

```json
    "Ethereum": {
      "term": "Ethereum",
      "phonetic": "/ɪˈθiːriəm/",
      "partOfSpeech": "noun",
      "definition": "A public blockchain network and decentralized software platform upon which developers build and run applications. As it is a proper noun, it should always be capitalized.",
      "termCategory": "project or product",
      "source": "",
      "datefirstseen": ""
    },
```

This script will, essentially, only be updating the `term` field of each object.
The name of each overarching object will be the term from the `en_US` column, whereas the `term` key's value will be populated from the corresponding locale.
The `partOfSpeech` value has not been filled out for most terms in most languages, but should mirror that of the `en_US` locale, unless grammatically incorrect in that language.
The `termCategory` value should also mirror `en_US`, unless subsequently changed.
If there is no data to fill in a given value (e.g., "source"), it should be left blank at this point (`source: "",`).

For example:

```json
    "Ethereum": {
      "term": "حساب",
      "phonetic": "",
      "partOfSpeech": "noun",
      "definition": "",
      "termCategory": "project or product",
      "source": "",
      "datefirstseen": ""
    },
```

### `app-side-glossary.csv`

We need a way to export this information, and manage it, in .csv format, for less-technical people who don't want to handle .json files.
For this reason, these collective .json files from each locale will be exportable, via a script not yet written, to `./utils/data-import/app-side-glossary.csv`, for exportation to e.g. Google Sheets for editing and updates.

This can be changed over time, but here is a sample of what it looks like now:

```CSV

Term,Part of speech,Term Category,Phonetic,Definition,Source,Date first recorded
51% attack,noun,decentralized web,/ˈfɪfti wʌn pərˈsɛnt əˈtæk/,"If more than half the computer power or mining hash rate on a network is run by a single person or a single group of people, then a 51% attack is in operation. This means that this entity has full control of the network and can negatively affect a cryptocurrency by taking over mining operations, stopping or changing transactions, and double-spending coins.",,
account,noun,decentralized web,/əˈkaʊnt/," Accounts are records or statements of financial expenditure and receipts that relate to a particular period or purpose. In the world of crypto, this is referred to as a cryptocurrency account. It gives you certain benefits, and it is a requirement in order to use just about any cryptocurrency exchange. A cryptocurrency account gives you access to hot wallets, which allow you to quickly buy, sell and trade cryptocurrencies, and it gives you an identity or a way through which you can hold onto your public keys when it comes to the aforementioned process.",,
address,noun,decentralized web,"/ˈæd.rɛs/ ""ˈpʌblɪk ˈæd.rɛs""","Synonymous with ""public address"", ""wallet address"". Used to send and receive transactions on a blockchain network, and to identify different users; also referred to as a 'public key'. An address is an alphanumeric character string, which can also be represented as a scannable QR code. In Ethereum, the address begins with 0x. For example: 0x06A85356DCb5b307096726FB86A78c59D38e08ee",,

```

### Moving the information from .json to HTML

Once this information is in its .json files in corresponding locale folders, we can proceed to generate the site's content from it.

`./utils/build-pages.js` does the following:

- Contains a mapping of locales to human-readable language names, **which will be used as the names of the corresponding directories into which every entry page will be placed**:

```javascript
// Locale to Language Name Mapping
const languageNames = {
    "ar_AR": "العربية",
    "zh_CN": "中文-(简体)",
    "zh_TW": "中文-(繁體)",
    "nl_NL": "nederlands",
    "fr_FR": "français",
    "el_GR": "Ελληνικά",
    "ha_NG": "hausa",
    "hi_IN": "हिन्दी",
    "hu_HU": "magyar",
    "id_ID": "bahasa-indonesia",
    "ja_JP": "日本語",
    "ko_KR": "한국어",
    "fa_IR": "فارسی",
    "ms_MY": "bahasa-melayu",
    "pcm_NG": "naijá",
    "pl_PL": "polski",
    "pt_BR": "português-brasil",
    "ro_RO": "română",
    "ru_RU": "Русский",
    "es-419": "español-latinoamérica",
    "tl_PH": "tagalog",
    "th_TH": "ไทย",
    "tr_TR": "türkçe",
    "uk_UA": "Українська",
    "vi_VN": "tiếng-việt",
};

```

- Contains an entry template, which will be a wireframe HTML of what each `term`'s entry page should have on it:

```javascript
const template = `
<!DOCTYPE html>
<html lang="{{locale}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../../css/styles.css">
  <title>{{term}} - wordsofweb3</title>
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">
        <img src="../../assets/education-dao-circle.png" alt="Logo" />
        wordsofweb3
      </div>
    </nav>
  </header>
  <main>
    <h1 id="term">{{term}}</h1>
    <p id="phonetic"><strong>Phonetic:</strong> {{phonetic}}</p>
    <h3 id="partofspeech"><strong>Part of Speech:</strong> {{partOfSpeech}}</h3>
    <h3 id="category"><strong>Category:</strong> {{termCategory}}</h3>
    <p id="definition"><strong>Definition:</strong> {{definition}}</p>
  </main>
  <footer>
    <p>&copy; 2024 Education DAO</p>
  </footer>
</body>
</html>
`;
```

The script then dynamically creates content for each entry, by mapping structured content from the .json to the html ids:

```javascript
 Object.keys(terms).forEach((termKey) => {
    const termData = terms[termKey] || {};
    const termValue = termData.term || "";
    const phoneticValue = termData.phonetic || "";
    const partOfSpeechValue = termData.partOfSpeech || "";
    const definitionValue = termData.definition || "Definition not available.";
    const termCategoryValue = termData.termCategory || "";
```

The script then should save that HTML file (e.g. `cuenta.html`) in a directory which it will create (and overwrite the contents of if it already exists, to ensure the most up to date build / version) if it doesn't already exist.

The script should save these **static HTML files** to:

`./static/<languageName>/<termin-that-language>.html`

**TODO**: a consideration should be made for linking readers to the entry page for *the term whose page they're on, but in a different language*. So, if I'm reading an entry in French, there could be, e.g., a sidebar or section at the bottom of the page like so:

```markdown
### Read this entry in:
[Spanish](./path-to-entry-in-Spanish.html)
[English](./path-to-entry-in-English.html)

```
Given the fact that each `term` object will be labelled with its equivalent in English, a sort of reverse route mapping function could be developed to draw the connections between translations of given terms, and during the build process, create these links in the entry pages.

### Paths and slugs

Ideally, the url structure will be something like `wordsofweb3/home`; `wordsofweb3/account`; `wordsofweb3/cuenta`, with no prefixing of e.g. locale codes, etc. This may require a small file server, to make each locale's HTML files available at the top directory level.

Additionally, we should not, e.g., convert non-Latin alphabets into strings of `%%C9A%` etc.; this is meant to be a reference and educational site, and making the URLs unreadable to those trying to access it is contrary to its primary goals.

## Creating the connections between the `definitions`

Subsequent to the creation of the entry pages in `build-pages.js`, a second script is run (when invoked using `npm run build` and the `build.js` script): `./utils/intertextual.js` does the following:

- Ingest the corresponding `./locales/<locale-code>.json` file
- Iterate over the built files for that locale in `./static/<locale-code>/*`
- In each HTML file within that directory, locate the `<p id="description">` tag which will have been created by `build-pages.js`
- Search for terms or phrases which [match](#matching) a `term` key in the .json file
- For each match, create a hyperlink to that term, following the pattern `./<term-key>.html`. Given that all the .html files will be in the same directory, this should provide for easy resolution. **terms will not be indexed across languages**.

This script should have robust console logging and graceful error handling, given the number of edge cases it will present.
It should save this output to file at `./utils/intertextual-output-<number>.txt`, increasing the number each time so that subsequent versions of the log can be checked.

### Matching

There is a difficult implementation detail here: `stop words`, `stems`, and `plurals`.

A quality contextual search will use detailed information about the morphology of a given language to find a *good* match, not just something that happens to match a pattern.
One option is to leverage [lunr-languages](https://github.com/MihaiValentin/lunr-languages), which has a decent and open source (MPL) collection of such files.

# Overall site / `build` directory structure

```bash
./build (once build.js has been run (npm run build))
    index.html
    index.js
    ./js
        search.js
        navbar.js
    ./assets
        ./search-indices
            `<locale-code>-index.json` x number of locales
    ./css
        styles.css
    ./images
        `any images needed by the app`
    favicon.ico
    ./en-US
        51%-attack.html
        account.html
            etc.
    ./es-ES
        ataque-del-51%.html
        cuenta.html
        ...etc
```

## Navbar / top-level link structure

As stated, upon changing the language using the dropdown selector (or the URL bar), the `index.js` script will change the UI strings; it should also change *the search index used for any searches made*, such that if I have selected Nigerian Pidgin, I am searching the index of Nigerian Pidgin terms.


# Search

The search will be key functionality in this site.

The current plan is to use `lunr.js`, perhaps as the sole dependency added to this project, to build search indices during the build phase, which when created, are written to `./build/assets/search-indices/<locale-code>-index.json`. 

The search function should, as indicated, consult the linguistically correct search index for the locale the user has selected.

An autocomplete function would be nice, although that depends on how many dependencies that would bring into the app. The search function should display a new page--for which, perhaps, a `results.html` and `results.js` template should be made--which would display:

```markdown
## Term matches
- Terms that have the search query in them
## Definition matches
- Terms that have the search query in their `description` field
## Partial matches
- Terms that partially match the search query
```

In this way, the reader will be presented with the most relevant searches first.


# Build
There is a distinction made in this repo between the JS files in `./src/js`, and `./utils`:

./src/js: client-facing javascript, ie, things that run "in the site", such as the Search function that happens when you click the "search" button

vs

./utils: javascript intended for the build process, ie, things that run "to build the site", such as `build-search-indices.js`, which creates the static search index files.

For this reason, `build.js` is located in `utils`, and should only ever copy over to `./build/js/*` the JS files in `./src.js`.

## `build.js`

This script is invoked by `npm run build`, and will, in turn:

- Run anew `build-pages.js`
- Run `intertextual.js`
- Copy over the following directories and files:

```txt
./l10n  (recursively) to ./build/l10n
./public/assets/css to ./build/css
./public/assets/<files at this level> to ./build/assets
./public/assets/search-indices (recursively) to ./build/search-indices
./static/<languageName directories>/* to ./build/* (so, all files within ./static/deutsche, and all its contents, should be copied to ./build/deutsche)
index.html to ./build/index.html
index.js to ./build/index.js
```

# Deployment

This site will be deployed on IPFS, for starters, using Fleek.xyz. It can and probably should be deployed on other decentralized storage networks.

The intention is to route the ENS name `wordsofweb3.eth` to an IPNS hash using Fleek.xyz, such that it could be accessed at `wordsofweb3.eth.limo`, etc.
