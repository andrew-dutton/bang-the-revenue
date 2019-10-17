import React, { Component } from 'react'

class ForexRates extends Componenet {

  rates = {
    "07/2015": {
      "AUD/CAD": 1.05096,
      "AUD/USD": 1.34784,
      "AUD/GBP": 2.09684,
      "AUD/NZD": 0.89611
    },
    "08/2015": {
      "AUD/CAD": 1.04119,
      "AUD/USD": 1.36834,
      "AUD/GBP": 2.1327,
      "AUD/NZD": 0.89854
    },
    "09/2015": {
      "AUD/CAD": 1.0678,
      "AUD/USD": 1.41609,
      "AUD/GBP": 2.17205,
      "AUD/NZD": 0.89753
    },
    "10/2015": {
      "AUD/CAD": 1.062,
      "AUD/USD": 1.38807,
      "AUD/GBP": 2.12727,
      "AUD/NZD": 0.92677
    },
    "11/2015": {
      "AUD/CAD": 1.05415,
      "AUD/USD": 1.39994,
      "AUD/GBP": 2.12707,
      "AUD/NZD": 0.9191
    },
    "12/2015": {
      "AUD/CAD": 1.00744,
      "AUD/USD": 1.3801,
      "AUD/GBP": 2.07052,
      "AUD/NZD": 0.93073
    },
    "01/2016": {
      "AUD/CAD": 1.00334,
      "AUD/USD": 1.42272,
      "AUD/GBP": 2.0509,
      "AUD/NZD": 0.93313
    },
    "02/2016": {
      "AUD/CAD": 1.01674,
      "AUD/USD": 1.40347,
      "AUD/GBP": 2.00934,
      "AUD/NZD": 0.93017
    },
    "03/2016": {
      "AUD/CAD": 1.00816,
      "AUD/USD": 1.33475,
      "AUD/GBP": 1.9015,
      "AUD/NZD": 0.89914
    },
    "04/2016": {
      "AUD/CAD": 1.01645,
      "AUD/USD": 1.30488,
      "AUD/GBP": 1.86584,
      "AUD/NZD": 0.89843
    },
    "05/2016": {
      "AUD/CAD": 1.05623,
      "AUD/USD": 1.36586,
      "AUD/GBP": 1.9838,
      "AUD/NZD": 0.92912
    },
    "06/2016": {
      "AUD/CAD": 1.04868,
      "AUD/USD": 1.35286,
      "AUD/GBP": 1.9267,
      "AUD/NZD": 0.95099
    },
    "07/2016": {
      "AUD/CAD": 1.0194,
      "AUD/USD": 1.32842,
      "AUD/GBP": 1.7457,
      "AUD/NZD": 0.94856
    },
    "08/2016": {
      "AUD/CAD": 1.00894,
      "AUD/USD": 1.31111,
      "AUD/GBP": 1.71609,
      "AUD/NZD": 0.94702
    },
    "09/2016": {
      "AUD/CAD": 1.00791,
      "AUD/USD": 1.32083,
      "AUD/GBP": 1.73621,
      "AUD/NZD": 0.96394
    },
    "10/2016": {
      "AUD/CAD": 0.99154,
      "AUD/USD": 1.31305,
      "AUD/GBP": 1.62476,
      "AUD/NZD": 0.94051
    },
    "11/2016": {
      "AUD/CAD": 0.98835,
      "AUD/USD": 1.33011,
      "AUD/GBP": 1.65596,
      "AUD/NZD": 0.94935
    },
    "12/2016": {
      "AUD/CAD": 1.02123,
      "AUD/USD": 1.36318,
      "AUD/GBP": 1.70089,
      "AUD/NZD": 0.95776
    },
    "01/2017": {
      "AUD/CAD": 1.01582,
      "AUD/USD": 1.34212,
      "AUD/GBP": 1.6571,
      "AUD/NZD": 0.95505
    },
    "02/2017": {
      "AUD/CAD": 0.99551,
      "AUD/USD": 1.30407,
      "AUD/GBP": 1.62802,
      "AUD/NZD": 0.94249
    },
    "03/2017": {
      "AUD/CAD": 0.98013,
      "AUD/USD": 1.31228,
      "AUD/GBP": 1.6196,
      "AUD/NZD": 0.91913
    },
    "04/2017": {
      "AUD/CAD": 0.98736,
      "AUD/USD": 1.32732,
      "AUD/GBP": 1.67798,
      "AUD/NZD": 0.92471
    },
    "05/2017": {
      "AUD/CAD": 0.98972,
      "AUD/USD": 1.3455,
      "AUD/GBP": 1.73846,
      "AUD/NZD": 0.93527
    },
    "06/2017": {
      "AUD/CAD": 0.99402,
      "AUD/USD": 1.32369,
      "AUD/GBP": 1.69436,
      "AUD/NZD": 0.95676
    },
    "07/2017": {
      "AUD/CAD": 1.01009,
      "AUD/USD": 1.28253,
      "AUD/GBP": 1.66777,
      "AUD/NZD": 0.94444
    },
    "08/2017": {
      "AUD/CAD": 1.00198,
      "AUD/USD": 1.26334,
      "AUD/GBP": 1.63683,
      "AUD/NZD": 0.92309
    },
    "09/2017": {
      "AUD/CAD": 1.02046,
      "AUD/USD": 1.25372,
      "AUD/GBP": 1.66926,
      "AUD/NZD": 0.90963
    },
    "10/2017": {
      "AUD/CAD": 1.01899,
      "AUD/USD": 1.28449,
      "AUD/GBP": 1.695,
      "AUD/NZD": 0.90402
    },
    "11/2017": {
      "AUD/CAD": 1.0284,
      "AUD/USD": 1.31207,
      "AUD/GBP": 1.73405,
      "AUD/NZD": 0.90349
    },
    "12/2017": {
      "AUD/CAD": 1.02418,
      "AUD/USD": 1.30603,
      "AUD/GBP": 1.75058,
      "AUD/NZD": 0.91041
    },
    "01/2018": {
      "AUD/CAD": 1.01123,
      "AUD/USD": 1.25742,
      "AUD/GBP": 1.73677,
      "AUD/NZD": 0.91238
    },
    "02/2018": {
      "AUD/CAD": 1.01046,
      "AUD/USD": 1.27076,
      "AUD/GBP": 1.77506,
      "AUD/NZD": 0.92866
    },
    "03/2018": {
      "AUD/CAD": 0.99706,
      "AUD/USD": 1.28906,
      "AUD/GBP": 1.80025,
      "AUD/NZD": 0.93494
    },
    "04/2018": {
      "AUD/CAD": 1.02153,
      "AUD/USD": 1.30191,
      "AUD/GBP": 1.83085,
      "AUD/NZD": 0.94254
    },
    "05/2018": {
      "AUD/CAD": 1.03168,
      "AUD/USD": 1.32797,
      "AUD/GBP": 1.78805,
      "AUD/NZD": 0.92345
    },
    "06/2018": {
      "AUD/CAD": 1.01664,
      "AUD/USD": 1.33423,
      "AUD/GBP": 1.77375,
      "AUD/NZD": 0.92598
    },
    "07/2018": {
      "AUD/CAD": 1.02833,
      "AUD/USD": 1.3505,
      "AUD/GBP": 1.77862,
      "AUD/NZD": 0.91688
    },
    "08/2018": {
      "AUD/CAD": 1.04582,
      "AUD/USD": 1.36474,
      "AUD/GBP": 1.75584,
      "AUD/NZD": 0.90966
    },
    "09/2018": {
      "AUD/CAD": 1.06566,
      "AUD/USD": 1.38889,
      "AUD/GBP": 1.81141,
      "AUD/NZD": 0.91644
    },
    "10/2018": {
      "AUD/CAD": 1.08114,
      "AUD/USD": 1.4077,
      "AUD/GBP": 1.83299,
      "AUD/NZD": 0.91877
    },
    "11/2018": {
      "AUD/CAD": 1.04565,
      "AUD/USD": 1.37995,
      "AUD/GBP": 1.78032,
      "AUD/NZD": 0.93472
    },
    "12/2018": {
      "AUD/CAD": 1.03837,
      "AUD/USD": 1.39689,
      "AUD/GBP": 1.77105,
      "AUD/NZD": 0.95087
    },
    "01/2019": {
      "AUD/CAD": 1.05103,
      "AUD/USD": 1.39809,
      "AUD/GBP": 1.80309,
      "AUD/NZD": 0.94786
    },
    "02/2019": {
      "AUD/CAD": 1.06049,
      "AUD/USD": 1.40017,
      "AUD/GBP": 1.82165,
      "AUD/NZD": 0.95681
    },
    "03/2019": {
      "AUD/CAD": 1.05644,
      "AUD/USD": 1.4127,
      "AUD/GBP": 1.85954,
      "AUD/NZD": 0.96486
    },
    "04/2019": {
      "AUD/CAD": 1.05038,
      "AUD/USD": 1.40585,
      "AUD/GBP": 1.83096,
      "AUD/NZD": 0.94363
    },
    "05/2019": {
      "AUD/CAD": 1.06998,
      "AUD/USD": 1.43967,
      "AUD/GBP": 1.85111,
      "AUD/NZD": 0.94515
    },
    "06/2019": {
      "AUD/CAD": 1.08205,
      "AUD/USD": 1.43935,
      "AUD/GBP": 1.82457,
      "AUD/NZD": 0.95006
    },
    "07/2019": {
      "AUD/CAD": 1.093078,
      "AUD/USD": 1.432225,
      "AUD/GBP": 1.786366,
      "AUD/NZD": 0.956535
    },
    "08/2019": {
      "AUD/CAD": 1.111795,
      "AUD/USD": 1.476194,
      "AUD/GBP": 1.794814,
      "AUD/NZD": 0.950012
    },
    "09/2019": {
      "AUD/CAD": 1.108747,
      "AUD/USD": 1.468828,
      "AUD/GBP": 1.81477,
      "AUD/NZD": 0.931331
    }
  }

}

export default ForexRates