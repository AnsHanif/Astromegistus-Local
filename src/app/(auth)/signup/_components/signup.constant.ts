export const DATE_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { label: day.toString(), value: day.toString() };
});

export const MONTH_OPTIONS = [
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];

export const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: year.toString(), value: year.toString() };
});

export const GENDER_TYPE = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const TIME_OF_BIRTH_HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1;
  return {
    label: hour.toString().padStart(2, '0'),
    value: hour.toString().padStart(2, '0'),
  };
});

// Minutes (00–59)
export const TIME_OF_BIRTH_MINUTES = Array.from({ length: 60 }, (_, i) => {
  const minute = i;
  return {
    label: minute.toString().padStart(2, '0'),
    value: minute.toString().padStart(2, '0'),
  };
});

// AM/PM options
export const TIME_OF_BIRTH_PERIOD = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
];

// export const PLACE_OF_BIRTH_OPTIONS = [
//   { label: 'Afghanistan', value: 'Afghanistan' },
//   { label: 'Albania', value: 'Albania' },
//   { label: 'Algeria', value: 'Algeria' },
//   { label: 'Andorra', value: 'Andorra' },
//   { label: 'Angola', value: 'Angola' },
//   { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
//   { label: 'Argentina', value: 'Argentina' },
//   { label: 'Armenia', value: 'Armenia' },
//   { label: 'Australia', value: 'Australia' },
//   { label: 'Austria', value: 'Austria' },
//   { label: 'Azerbaijan', value: 'Azerbaijan' },
//   { label: 'Bahamas', value: 'Bahamas' },
//   { label: 'Bahrain', value: 'Bahrain' },
//   { label: 'Bangladesh', value: 'Bangladesh' },
//   { label: 'Barbados', value: 'Barbados' },
//   { label: 'Belarus', value: 'Belarus' },
//   { label: 'Belgium', value: 'Belgium' },
//   { label: 'Belize', value: 'Belize' },
//   { label: 'Benin', value: 'Benin' },
//   { label: 'Bhutan', value: 'Bhutan' },
//   { label: 'Bolivia', value: 'Bolivia' },
//   { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
//   { label: 'Botswana', value: 'Botswana' },
//   { label: 'Brazil', value: 'Brazil' },
//   { label: 'Brunei', value: 'Brunei' },
//   { label: 'Bulgaria', value: 'Bulgaria' },
//   { label: 'Burkina Faso', value: 'Burkina Faso' },
//   { label: 'Burundi', value: 'Burundi' },
//   { label: 'Cambodia', value: 'Cambodia' },
//   { label: 'Cameroon', value: 'Cameroon' },
//   { label: 'Canada', value: 'Canada' },
//   { label: 'Cape Verde', value: 'Cape Verde' },
//   { label: 'Central African Republic', value: 'Central African Republic' },
//   { label: 'Chad', value: 'Chad' },
//   { label: 'Chile', value: 'Chile' },
//   { label: 'China', value: 'China' },
//   { label: 'Colombia', value: 'Colombia' },
//   { label: 'Comoros', value: 'Comoros' },
//   { label: 'Congo (Brazzaville)', value: 'Congo (Brazzaville)' },
//   { label: 'Congo (Kinshasa)', value: 'Congo (Kinshasa)' },
//   { label: 'Costa Rica', value: 'Costa Rica' },
//   { label: 'Croatia', value: 'Croatia' },
//   { label: 'Cuba', value: 'Cuba' },
//   { label: 'Cyprus', value: 'Cyprus' },
//   { label: 'Czech Republic', value: 'Czech Republic' },
//   { label: 'Denmark', value: 'Denmark' },
//   { label: 'Djibouti', value: 'Djibouti' },
//   { label: 'Dominica', value: 'Dominica' },
//   { label: 'Dominican Republic', value: 'Dominican Republic' },
//   { label: 'Ecuador', value: 'Ecuador' },
//   { label: 'Egypt', value: 'Egypt' },
//   { label: 'El Salvador', value: 'El Salvador' },
//   { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
//   { label: 'Eritrea', value: 'Eritrea' },
//   { label: 'Estonia', value: 'Estonia' },
//   { label: 'Eswatini', value: 'Eswatini' },
//   { label: 'Ethiopia', value: 'Ethiopia' },
//   { label: 'Fiji', value: 'Fiji' },
//   { label: 'Finland', value: 'Finland' },
//   { label: 'France', value: 'France' },
//   { label: 'Gabon', value: 'Gabon' },
//   { label: 'Gambia', value: 'Gambia' },
//   { label: 'Georgia', value: 'Georgia' },
//   { label: 'Germany', value: 'Germany' },
//   { label: 'Ghana', value: 'Ghana' },
//   { label: 'Greece', value: 'Greece' },
//   { label: 'Grenada', value: 'Grenada' },
//   { label: 'Guatemala', value: 'Guatemala' },
//   { label: 'Guinea', value: 'Guinea' },
//   { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
//   { label: 'Guyana', value: 'Guyana' },
//   { label: 'Haiti', value: 'Haiti' },
//   { label: 'Honduras', value: 'Honduras' },
//   { label: 'Hungary', value: 'Hungary' },
//   { label: 'Iceland', value: 'Iceland' },
//   { label: 'India', value: 'India' },
//   { label: 'Indonesia', value: 'Indonesia' },
//   { label: 'Iran', value: 'Iran' },
//   { label: 'Iraq', value: 'Iraq' },
//   { label: 'Ireland', value: 'Ireland' },
//   { label: 'Israel', value: 'Israel' },
//   { label: 'Italy', value: 'Italy' },
//   { label: 'Jamaica', value: 'Jamaica' },
//   { label: 'Japan', value: 'Japan' },
//   { label: 'Jordan', value: 'Jordan' },
//   { label: 'Kazakhstan', value: 'Kazakhstan' },
//   { label: 'Kenya', value: 'Kenya' },
//   { label: 'Kiribati', value: 'Kiribati' },
//   { label: 'Kuwait', value: 'Kuwait' },
//   { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
//   { label: 'Laos', value: 'Laos' },
//   { label: 'Latvia', value: 'Latvia' },
//   { label: 'Lebanon', value: 'Lebanon' },
//   { label: 'Lesotho', value: 'Lesotho' },
//   { label: 'Liberia', value: 'Liberia' },
//   { label: 'Libya', value: 'Libya' },
//   { label: 'Liechtenstein', value: 'Liechtenstein' },
//   { label: 'Lithuania', value: 'Lithuania' },
//   { label: 'Luxembourg', value: 'Luxembourg' },
//   { label: 'Madagascar', value: 'Madagascar' },
//   { label: 'Malawi', value: 'Malawi' },
//   { label: 'Malaysia', value: 'Malaysia' },
//   { label: 'Maldives', value: 'Maldives' },
//   { label: 'Mali', value: 'Mali' },
//   { label: 'Malta', value: 'Malta' },
//   { label: 'Marshall Islands', value: 'Marshall Islands' },
//   { label: 'Mauritania', value: 'Mauritania' },
//   { label: 'Mauritius', value: 'Mauritius' },
//   { label: 'Mexico', value: 'Mexico' },
//   { label: 'Micronesia', value: 'Micronesia' },
//   { label: 'Moldova', value: 'Moldova' },
//   { label: 'Monaco', value: 'Monaco' },
//   { label: 'Mongolia', value: 'Mongolia' },
//   { label: 'Montenegro', value: 'Montenegro' },
//   { label: 'Morocco', value: 'Morocco' },
//   { label: 'Mozambique', value: 'Mozambique' },
//   { label: 'Myanmar', value: 'Myanmar' },
//   { label: 'Namibia', value: 'Namibia' },
//   { label: 'Nauru', value: 'Nauru' },
//   { label: 'Nepal', value: 'Nepal' },
//   { label: 'Netherlands', value: 'Netherlands' },
//   { label: 'New Zealand', value: 'New Zealand' },
//   { label: 'Nicaragua', value: 'Nicaragua' },
//   { label: 'Niger', value: 'Niger' },
//   { label: 'Nigeria', value: 'Nigeria' },
//   { label: 'North Korea', value: 'North Korea' },
//   { label: 'North Macedonia', value: 'North Macedonia' },
//   { label: 'Norway', value: 'Norway' },
//   { label: 'Oman', value: 'Oman' },
//   { label: 'Pakistan', value: 'Pakistan' },
//   { label: 'Palau', value: 'Palau' },
//   { label: 'Panama', value: 'Panama' },
//   { label: 'Papua New Guinea', value: 'Papua New Guinea' },
//   { label: 'Paraguay', value: 'Paraguay' },
//   { label: 'Peru', value: 'Peru' },
//   { label: 'Philippines', value: 'Philippines' },
//   { label: 'Poland', value: 'Poland' },
//   { label: 'Portugal', value: 'Portugal' },
//   { label: 'Qatar', value: 'Qatar' },
//   { label: 'Romania', value: 'Romania' },
//   { label: 'Russia', value: 'Russia' },
//   { label: 'Rwanda', value: 'Rwanda' },
//   { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
//   { label: 'Saint Lucia', value: 'Saint Lucia' },
//   {
//     label: 'Saint Vincent and the Grenadines',
//     value: 'Saint Vincent and the Grenadines',
//   },
//   { label: 'Samoa', value: 'Samoa' },
//   { label: 'San Marino', value: 'San Marino' },
//   { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
//   { label: 'Saudi Arabia', value: 'Saudi Arabia' },
//   { label: 'Senegal', value: 'Senegal' },
//   { label: 'Serbia', value: 'Serbia' },
//   { label: 'Seychelles', value: 'Seychelles' },
//   { label: 'Sierra Leone', value: 'Sierra Leone' },
//   { label: 'Singapore', value: 'Singapore' },
//   { label: 'Slovakia', value: 'Slovakia' },
//   { label: 'Slovenia', value: 'Slovenia' },
//   { label: 'Solomon Islands', value: 'Solomon Islands' },
//   { label: 'Somalia', value: 'Somalia' },
//   { label: 'South Africa', value: 'South Africa' },
//   { label: 'South Korea', value: 'South Korea' },
//   { label: 'South Sudan', value: 'South Sudan' },
//   { label: 'Spain', value: 'Spain' },
//   { label: 'Sri Lanka', value: 'Sri Lanka' },
//   { label: 'Sudan', value: 'Sudan' },
//   { label: 'Suriname', value: 'Suriname' },
//   { label: 'Sweden', value: 'Sweden' },
//   { label: 'Switzerland', value: 'Switzerland' },
//   { label: 'Syria', value: 'Syria' },
//   { label: 'Taiwan', value: 'Taiwan' },
//   { label: 'Tajikistan', value: 'Tajikistan' },
//   { label: 'Tanzania', value: 'Tanzania' },
//   { label: 'Thailand', value: 'Thailand' },
//   { label: 'Timor-Leste', value: 'Timor-Leste' },
//   { label: 'Togo', value: 'Togo' },
//   { label: 'Tonga', value: 'Tonga' },
//   { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
//   { label: 'Tunisia', value: 'Tunisia' },
//   { label: 'Turkey', value: 'Turkey' },
//   { label: 'Turkmenistan', value: 'Turkmenistan' },
//   { label: 'Tuvalu', value: 'Tuvalu' },
//   { label: 'Uganda', value: 'Uganda' },
//   { label: 'Ukraine', value: 'Ukraine' },
//   { label: 'United Arab Emirates', value: 'United Arab Emirates' },
//   { label: 'United Kingdom', value: 'United Kingdom' },
//   { label: 'United States', value: 'United States' },
//   { label: 'Uruguay', value: 'Uruguay' },
//   { label: 'Uzbekistan', value: 'Uzbekistan' },
//   { label: 'Vanuatu', value: 'Vanuatu' },
//   { label: 'Vatican City', value: 'Vatican City' },
//   { label: 'Venezuela', value: 'Venezuela' },
//   { label: 'Vietnam', value: 'Vietnam' },
//   { label: 'Yemen', value: 'Yemen' },
//   { label: 'Zambia', value: 'Zambia' },
//   { label: 'Zimbabwe', value: 'Zimbabwe' },
// ];

export const PLACE_OF_BIRTH_OPTIONS = [
  { value: 'AF', label: 'Afghanistan (+93)' },
  { value: 'AL', label: 'Albania (+355)' },
  { value: 'DZ', label: 'Algeria (+213)' },
  {
    value: 'AD',
    label: 'Andorra (+376)',
  },
  {
    value: 'AO',
    label: 'Angola (+244)',
  },
  {
    value: 'AG',
    label: 'Antigua & Deps (+1268)',
  },
  {
    value: 'AR',
    label: 'Argentina (+54)',
  },
  {
    value: 'AM',
    label: 'Armenia (+374)',
  },
  {
    value: 'AU',
    label: 'Australia (+61)',
  },
  {
    value: 'AT',
    label: 'Austria (+43)',
  },
  {
    value: 'AZ',
    label: 'Azerbaijan (+994)',
  },
  {
    value: 'BS',
    label: 'Bahamas (+1242)',
  },
  {
    value: 'BH',
    label: 'Bahrain (+973)',
  },
  {
    value: 'BD',
    label: 'Bangladesh (+880)',
  },
  {
    value: 'BB',
    label: 'Barbados (+1246)',
  },
  {
    value: 'BY',
    label: 'Belarus (+375)',
  },
  {
    value: 'BE',
    label: 'Belgium (+32)',
  },
  {
    value: 'BZ',
    label: 'Belize (+501)',
  },
  {
    value: 'BJ',
    label: 'Benin (+229)',
  },
  {
    value: 'BM',
    label: 'Bermuda (+1-441)',
  },
  {
    value: 'BT',
    label: 'Bhutan (+975)',
  },
  {
    value: 'BO',
    label: 'Bolivia (+591)',
  },
  {
    value: 'BA',
    label: 'Bosnia Herzegovina (+387)',
  },
  {
    value: 'BW',
    label: 'Botswana (+267)',
  },
  {
    value: 'BR',
    label: 'Brazil (+55)',
  },
  {
    value: 'BN',
    label: 'Brunei (+673)',
  },
  {
    value: 'BG',
    label: 'Bulgaria (+359)',
  },
  {
    value: 'BF',
    label: 'Burkina Faso (+226)',
  },
  {
    value: 'BI',
    label: 'Burundi (+257)',
  },
  {
    value: 'KH',
    label: 'Cambodia (+855)',
  },
  {
    value: 'CM',
    label: 'Cameroon (+237)',
  },
  {
    value: 'CA',
    label: 'Canada (+1)',
  },
  {
    value: 'CV',
    label: 'Cape Verde (+238)',
  },
  {
    value: 'CF',
    label: 'Central African Rep (+236)',
  },
  {
    value: 'TD',
    label: 'Chad (+235)',
  },
  {
    value: 'CL',
    label: 'Chile (+56)',
  },
  {
    value: 'CN',
    label: 'China (+86)',
  },
  {
    value: 'CO',
    label: 'Colombia (+57)',
  },
  {
    value: 'KM',
    label: 'Comoros (+269)',
  },
  {
    value: 'CG',
    label: 'Congo (+242)',
  },
  {
    value: 'CD',
    label: 'Congo (Democratic Rep) (+243)',
  },
  {
    value: 'CR',
    label: 'Costa Rica (+506)',
  },
  {
    value: 'HR',
    label: 'Croatia (+385)',
  },
  {
    value: 'CU',
    label: 'Cuba (+53)',
  },
  {
    value: 'CY',
    label: 'Cyprus (+357)',
  },
  {
    value: 'CZ',
    label: 'Czech Republic (+420)',
  },
  {
    value: 'DK',
    label: 'Denmark (+45)',
  },
  {
    value: 'DJ',
    label: 'Djibouti (+253)',
  },
  {
    value: 'DM',
    label: 'Dominica (+1767)',
  },
  {
    value: 'DO',
    label: 'Dominican Republic (+1809)',
  },
  {
    value: 'EC',
    label: 'Ecuador (+593)',
  },
  {
    value: 'EG',
    label: 'Egypt (+20)',
  },
  {
    value: 'SV',
    label: 'El Salvador (+503)',
  },
  {
    value: 'GQ',
    label: 'Equatorial Guinea (+240)',
  },
  {
    value: 'ER',
    label: 'Eritrea (+291)',
  },
  {
    value: 'EE',
    label: 'Estonia (+372)',
  },
  {
    value: 'ET',
    label: 'Ethiopia (+251)',
  },
  {
    value: 'FI',
    label: 'Finland (+358)',
  },
  {
    value: 'FR',
    label: 'France (+33)',
  },
  {
    value: 'GA',
    label: 'Gabon (+241)',
  },
  {
    value: 'GM',
    label: 'Gambia (+220)',
  },
  {
    value: 'GE',
    label: 'Georgia (+995)',
  },
  {
    value: 'DE',
    label: 'Germany (+49)',
  },
  {
    value: 'GH',
    label: 'Ghana (+233)',
  },
  {
    value: 'GR',
    label: 'Greece (+30)',
  },
  {
    value: 'GD',
    label: 'Grenada (+1-473)',
  },
  {
    value: 'GT',
    label: 'Guatemala (+502)',
  },
  {
    value: 'GN',
    label: 'Guinea (+224)',
  },
  {
    value: 'GW',
    label: 'Guinea-Bissau (+245)',
  },
  {
    value: 'GY',
    label: 'Guyana (+592)',
  },
  {
    value: 'HT',
    label: 'Haiti (+509)',
  },
  {
    value: 'HN',
    label: 'Honduras (+504)',
  },
  {
    value: 'HU',
    label: 'Hungary (+36)',
  },
  {
    value: 'IS',
    label: 'Iceland (+354)',
  },
  {
    value: 'IN',
    label: 'India (+91)',
  },
  {
    value: 'ID',
    label: 'Indonesia (+62)',
  },
  {
    value: 'IR',
    label: 'Iran (+98)',
  },
  {
    value: 'IQ',
    label: 'Iraq (+964)',
  },
  {
    value: 'IE',
    label: 'Ireland (Republic) (+353)',
  },
  {
    value: 'IL',
    label: 'Israel (+972)',
  },
  {
    value: 'IT',
    label: 'Italy (+39)',
  },
  {
    value: 'CI',
    label: 'Ivory Coast (+225)',
  },
  {
    value: 'JM',
    label: 'Jamaica (+1-876)',
  },
  {
    value: 'JP',
    label: 'Japan (+81)',
  },
  {
    value: 'JO',
    label: 'Jordan (+962)',
  },
  {
    value: 'KZ',
    label: 'Kazakhstan (+7)',
  },
  {
    value: 'KE',
    label: 'Kenya (+254)',
  },
  {
    value: 'KI',
    label: 'Kiribati (+686)',
  },
  {
    value: 'KP',
    label: 'Korea North (+850)',
  },
  {
    value: 'KR',
    label: 'Korea South (+82)',
  },
  {
    value: 'XK',
    label: 'Kosovo (+381)',
  },
  {
    value: 'KW',
    label: 'Kuwait (+965)',
  },
  {
    value: 'KG',
    label: 'Kyrgyzstan (+996)',
  },
  {
    value: 'LA',
    label: 'Laos (+856)',
  },
  {
    value: 'LV',
    label: 'Latvia (+371)',
  },
  {
    value: 'LB',
    label: 'Lebanon (+961)',
  },
  {
    value: 'LS',
    label: 'Lesotho (+266)',
  },
  {
    value: 'LR',
    label: 'Liberia (+231)',
  },
  {
    value: 'LY',
    label: 'Libya (+218)',
  },
  {
    value: 'LI',
    label: 'Liechtenstein (+423)',
  },
  {
    value: 'LT',
    label: 'Lithuania (+370)',
  },
  {
    value: 'LU',
    label: 'Luxembourg (+352)',
  },
  {
    value: 'MK',
    label: 'Macedonia (+389)',
  },
  {
    value: 'MG',
    label: 'Madagascar (+261)',
  },
  {
    value: 'MW',
    label: 'Malawi (+265)',
  },
  {
    value: 'MY',
    label: 'Malaysia (+60)',
  },
  {
    value: 'MV',
    label: 'Maldives (+960)',
  },
  {
    value: 'ML',
    label: 'Mali (+223)',
  },
  {
    value: 'MT',
    label: 'Malta (+356)',
  },
  {
    value: 'MH',
    label: 'Marshall Islands (+692)',
  },
  {
    value: 'MR',
    label: 'Mauritania (+222)',
  },
  {
    value: 'MU',
    label: 'Mauritius (+230)',
  },
  {
    value: 'MX',
    label: 'Mexico (+52)',
  },
  {
    value: 'FM',
    label: 'Micronesia (+691)',
  },
  {
    value: 'MD',
    label: 'Moldova (+373)',
  },
  {
    value: 'MC',
    label: 'Monaco (+377)',
  },
  {
    value: 'MN',
    label: 'Mongolia (+976)',
  },
  {
    value: 'ME',
    label: 'Montenegro (+382)',
  },
  {
    value: 'MA',
    label: 'Morocco (+212)',
  },
  {
    value: 'MZ',
    label: 'Mozambique (+258)',
  },
  {
    value: 'MM',
    label: 'Myanmar (+95)',
  },
  {
    value: 'NA',
    label: 'Namibia (+264)',
  },
  {
    value: 'NR',
    label: 'Nauru (+674)',
  },
  {
    value: 'NP',
    label: 'Nepal (+977)',
  },
  {
    value: 'NL',
    label: 'Netherlands (+31)',
  },
  {
    value: 'NZ',
    label: 'New Zealand (+64)',
  },
  {
    value: 'NI',
    label: 'Nicaragua (+505)',
  },
  {
    value: 'NE',
    label: 'Niger (+227)',
  },
  {
    value: 'NG',
    label: 'Nigeria (+234)',
  },
  {
    value: 'NO',
    label: 'Norway (+47)',
  },
  {
    value: 'OM',
    label: 'Oman (+968)',
  },
  {
    value: 'PK',
    label: 'Pakistan (+92)',
  },
  {
    value: 'PW',
    label: 'Palau (+680)',
  },
  {
    value: 'PA',
    label: 'Panama (+507)',
  },
  {
    value: 'PG',
    label: 'Papua New Guinea (+675)',
  },
  {
    value: 'PY',
    label: 'Paraguay (+595)',
  },
  {
    value: 'PE',
    label: 'Peru (+51)',
  },
  {
    value: 'PH',
    label: 'Philippines (+63)',
  },
  {
    value: 'PL',
    label: 'Poland (+48)',
  },
  {
    value: 'PT',
    label: 'Portugal (+351)',
  },
  {
    value: 'QA',
    label: 'Qatar (+974)',
  },
  {
    value: 'RO',
    label: 'Romania (+40)',
  },
  {
    value: 'RU',
    label: 'Russia (+7)',
  },
  {
    value: 'RW',
    label: 'Rwanda (+250)',
  },
  {
    value: 'KN',
    label: 'St Kitts & Nevis (+1)',
  },
  {
    value: 'LC',
    label: 'St Lucia (+1)',
  },
  {
    value: 'VC',
    label: 'Saint Vincent & the Grenadines (+1)',
  },
  {
    value: 'WS',
    label: 'Samoa (+685)',
  },
  {
    value: 'SM',
    label: 'San Marino (+378)',
  },
  {
    value: 'ST',
    label: 'Sao Tome & Principe (+239)',
  },
  {
    value: 'SA',
    label: 'Saudi Arabia (+966)',
  },
  {
    value: 'SN',
    label: 'Senegal (+221)',
  },
  {
    value: 'RS',
    label: 'Serbia (+381)',
  },
  {
    value: 'SC',
    label: 'Seychelles (+248)',
  },
  {
    value: 'SL',
    label: 'Sierra Leone (+232)',
  },
  {
    value: 'SG',
    label: 'Singapore (+65)',
  },
  {
    value: 'SK',
    label: 'Slovakia (+421)',
  },
  {
    value: 'SI',
    label: 'Slovenia (+386)',
  },
  {
    value: 'SB',
    label: 'Solomon Islands (+677)',
  },
  {
    value: 'SO',
    label: 'Somalia (+252)',
  },
  {
    value: 'ZA',
    label: 'South Africa (+27)',
  },
  {
    value: 'SS',
    label: 'South Sudan (+211)',
  },
  {
    value: 'ES',
    label: 'Spain (+34)',
  },
  {
    value: 'LK',
    label: 'Sri Lanka (+94)',
  },
  {
    value: 'SD',
    label: 'Sudan (+249)',
  },
  {
    value: 'SR',
    label: 'Surilabel (+597)',
  },
  {
    value: 'SZ',
    label: 'Swaziland (+268)',
  },
  {
    value: 'SE',
    label: 'Sweden (+46)',
  },
  {
    value: 'CH',
    label: 'Switzerland (+41)',
  },
  {
    value: 'SY',
    label: 'Syria (+963)',
  },
  {
    value: 'TW',
    label: 'Taiwan (+886)',
  },
  {
    value: 'TJ',
    label: 'Tajikistan (+992)',
  },
  {
    value: 'TZ',
    label: 'Tanzania (+255)',
  },
  {
    value: 'TH',
    label: 'Thailand (+66)',
  },
  {
    value: 'TG',
    label: 'Togo (+228)',
  },
  {
    value: 'TO',
    label: 'Tonga (+676)',
  },

  {
    value: 'TN',
    label: 'Tunisia (+216)',
  },
  {
    value: 'TR',
    label: 'Turkey (+90)',
  },
  {
    value: 'TM',
    label: 'Turkmenistan (+993)',
  },
  {
    value: 'TV',
    label: 'Tuvalu (+688)',
  },
  {
    value: 'UG',
    label: 'Uganda (+256)',
  },
  {
    value: 'UA',
    label: 'Ukraine (+380)',
  },
  {
    value: 'AE',
    label: 'United Arab Emirates (+971)',
  },
  {
    value: 'GB',
    label: 'United Kingdom (+44)',
  },
  {
    value: 'US',
    label: 'United States (+1)',
  },
  {
    value: 'UY',
    label: 'Uruguay (+598)',
  },
  {
    value: 'UZ',
    label: 'Uzbekistan (+998)',
  },
  {
    value: 'VU',
    label: 'Vanuatu (+678)',
  },
  {
    value: 'VA',
    label: 'Vatican City (+379)',
  },
  {
    value: 'VE',
    label: 'Venezuela (+58)',
  },
  {
    value: 'VN',
    label: 'Vietnam (+84)',
  },
  {
    value: 'YE',
    label: 'Yemen (+967)',
  },
  {
    value: 'ZM',
    label: 'Zambia (+260)',
  },
  {
    value: 'ZW',
    label: 'Zimbabwe (+263)',
  },
];
