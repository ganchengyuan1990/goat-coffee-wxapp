const arrive = {
  'show':true,
  'days':[
    '今天(周一)',
    '明天(周二)',
    '6月17日(周三)',
    '6月18日(周四)'],
  'dayIndex':0,
  'selectedDayIndex':0,
  'unixtime':0,
  'arrival_timelist':[
    {
      'view_time':'立即送出',
      'date_type_tip':'立即送出',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':0,
      'delivery_time_tip':'',
      'select_view_time':'大约16:40送达'
    },
    {
      'view_time':'17:10',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592212200,
      'delivery_time_tip':'',
      'select_view_time':'17:10'
    },
    {
      'view_time':'17:30',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592213400,
      'delivery_time_tip':'',
      'select_view_time':'17:30'
    },
    {
      'view_time':'17:50',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592214600,
      'delivery_time_tip':'',
      'select_view_time':'17:50'
    },
    {
      'view_time':'18:10',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592215800,
      'delivery_time_tip':'',
      'select_view_time':'18:10'
    },
    {
      'view_time':'18:30',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592217000,
      'delivery_time_tip':'',
      'select_view_time':'18:30'
    },
    {
      'view_time':'18:50',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592218200,
      'delivery_time_tip':'',
      'select_view_time':'18:50'
    },
    {
      'view_time':'19:10',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592219400,
      'delivery_time_tip':'',
      'select_view_time':'19:10'
    },
    {
      'view_time':'19:30',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592220600,
      'delivery_time_tip':'',
      'select_view_time':'19:30'
    },
    {
      'view_time':'19:50',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592221800,
      'delivery_time_tip':'',
      'select_view_time':'19:50'
    },
    {
      'view_time':'20:10',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592223000,
      'delivery_time_tip':'',
      'select_view_time':'20:10'
    },
    {
      'view_time':'20:30',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592224200,
      'delivery_time_tip':'',
      'select_view_time':'20:30'
    },
    {
      'view_time':'20:50',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'5.0元配送费',
      'unixtime':1592225400,
      'delivery_time_tip':'',
      'select_view_time':'20:50'
    },
    {
      'view_time':'21:00',
      'date_type_tip':'指定时间',
      'view_shipping_fee':'8.0元配送费',
      'unixtime':1592226000,
      'delivery_time_tip':'',
      'select_view_time':'21:00'
    }],
  'expected_arrival_timelist':[
    [
      {
        'view_time':'立即送出',
        'date_type_tip':'立即送出',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':0,
        'delivery_time_tip':'',
        'select_view_time':'大约16:40送达'
      },
      {
        'view_time':'17:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592212200,
        'delivery_time_tip':'',
        'select_view_time':'17:10'
      },
      {
        'view_time':'17:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592213400,
        'delivery_time_tip':'',
        'select_view_time':'17:30'
      },
      {
        'view_time':'17:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592214600,
        'delivery_time_tip':'',
        'select_view_time':'17:50'
      },
      {
        'view_time':'18:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592215800,
        'delivery_time_tip':'',
        'select_view_time':'18:10'
      },
      {
        'view_time':'18:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592217000,
        'delivery_time_tip':'',
        'select_view_time':'18:30'
      },
      {
        'view_time':'18:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592218200,
        'delivery_time_tip':'',
        'select_view_time':'18:50'
      },
      {
        'view_time':'19:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592219400,
        'delivery_time_tip':'',
        'select_view_time':'19:10'
      },
      {
        'view_time':'19:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592220600,
        'delivery_time_tip':'',
        'select_view_time':'19:30'
      },
      {
        'view_time':'19:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592221800,
        'delivery_time_tip':'',
        'select_view_time':'19:50'
      },
      {
        'view_time':'20:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592223000,
        'delivery_time_tip':'',
        'select_view_time':'20:10'
      },
      {
        'view_time':'20:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592224200,
        'delivery_time_tip':'',
        'select_view_time':'20:30'
      },
      {
        'view_time':'20:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592225400,
        'delivery_time_tip':'',
        'select_view_time':'20:50'
      },
      {
        'view_time':'21:00',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'8.0元配送费',
        'unixtime':1592226000,
        'delivery_time_tip':'',
        'select_view_time':'21:00'
      }],
    [
      {
        'view_time':'07:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592263800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 07:30'
      },
      {
        'view_time':'07:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592265000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 07:50'
      },
      {
        'view_time':'08:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592266200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 08:10'
      },
      {
        'view_time':'08:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592267400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 08:30'
      },
      {
        'view_time':'08:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592268600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 08:50'
      },
      {
        'view_time':'09:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592269800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 09:10'
      },
      {
        'view_time':'09:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592271000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 09:30'
      },
      {
        'view_time':'09:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592272200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 09:50'
      },
      {
        'view_time':'10:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592273400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 10:10'
      },
      {
        'view_time':'10:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592274600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 10:30'
      },
      {
        'view_time':'10:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592275800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 10:50'
      },
      {
        'view_time':'11:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592277000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 11:10'
      },
      {
        'view_time':'11:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592278200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 11:30'
      },
      {
        'view_time':'11:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592279400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 11:50'
      },
      {
        'view_time':'12:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592280600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 12:10'
      },
      {
        'view_time':'12:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592281800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 12:30'
      },
      {
        'view_time':'12:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592283000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 12:50'
      },
      {
        'view_time':'13:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592284200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 13:10'
      },
      {
        'view_time':'13:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592285400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 13:30'
      },
      {
        'view_time':'13:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592286600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 13:50'
      },
      {
        'view_time':'14:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592287800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 14:10'
      },
      {
        'view_time':'14:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592289000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 14:30'
      },
      {
        'view_time':'14:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592290200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 14:50'
      },
      {
        'view_time':'15:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592291400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 15:10'
      },
      {
        'view_time':'15:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592292600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 15:30'
      },
      {
        'view_time':'15:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592293800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 15:50'
      },
      {
        'view_time':'16:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592295000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 16:10'
      },
      {
        'view_time':'16:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592296200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 16:30'
      },
      {
        'view_time':'16:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592297400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 16:50'
      },
      {
        'view_time':'17:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592298600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 17:10'
      },
      {
        'view_time':'17:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592299800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 17:30'
      },
      {
        'view_time':'17:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592301000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 17:50'
      },
      {
        'view_time':'18:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592302200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 18:10'
      },
      {
        'view_time':'18:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592303400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 18:30'
      },
      {
        'view_time':'18:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592304600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 18:50'
      },
      {
        'view_time':'19:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592305800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 19:10'
      },
      {
        'view_time':'19:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592307000,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 19:30'
      },
      {
        'view_time':'19:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592308200,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 19:50'
      },
      {
        'view_time':'20:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592309400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 20:10'
      },
      {
        'view_time':'20:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592310600,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 20:30'
      },
      {
        'view_time':'20:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592311800,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 20:50'
      },
      {
        'view_time':'21:00',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'8.0元配送费',
        'unixtime':1592312400,
        'delivery_time_tip':'',
        'select_view_time':'明天(周二) 21:00'
      }],
    [
      {
        'view_time':'07:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592350200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 07:30'
      },
      {
        'view_time':'07:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592351400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 07:50'
      },
      {
        'view_time':'08:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592352600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 08:10'
      },
      {
        'view_time':'08:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592353800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 08:30'
      },
      {
        'view_time':'08:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592355000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 08:50'
      },
      {
        'view_time':'09:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592356200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 09:10'
      },
      {
        'view_time':'09:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592357400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 09:30'
      },
      {
        'view_time':'09:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592358600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 09:50'
      },
      {
        'view_time':'10:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592359800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 10:10'
      },
      {
        'view_time':'10:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592361000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 10:30'
      },
      {
        'view_time':'10:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592362200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 10:50'
      },
      {
        'view_time':'11:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592363400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 11:10'
      },
      {
        'view_time':'11:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592364600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 11:30'
      },
      {
        'view_time':'11:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592365800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 11:50'
      },
      {
        'view_time':'12:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592367000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 12:10'
      },
      {
        'view_time':'12:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592368200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 12:30'
      },
      {
        'view_time':'12:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592369400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 12:50'
      },
      {
        'view_time':'13:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592370600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 13:10'
      },
      {
        'view_time':'13:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592371800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 13:30'
      },
      {
        'view_time':'13:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592373000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 13:50'
      },
      {
        'view_time':'14:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592374200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 14:10'
      },
      {
        'view_time':'14:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592375400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 14:30'
      },
      {
        'view_time':'14:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592376600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 14:50'
      },
      {
        'view_time':'15:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592377800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 15:10'
      },
      {
        'view_time':'15:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592379000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 15:30'
      },
      {
        'view_time':'15:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592380200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 15:50'
      },
      {
        'view_time':'16:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592381400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 16:10'
      },
      {
        'view_time':'16:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592382600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 16:30'
      },
      {
        'view_time':'16:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592383800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 16:50'
      },
      {
        'view_time':'17:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592385000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 17:10'
      },
      {
        'view_time':'17:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592386200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 17:30'
      },
      {
        'view_time':'17:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592387400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 17:50'
      },
      {
        'view_time':'18:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592388600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 18:10'
      },
      {
        'view_time':'18:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592389800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 18:30'
      },
      {
        'view_time':'18:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592391000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 18:50'
      },
      {
        'view_time':'19:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592392200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 19:10'
      },
      {
        'view_time':'19:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592393400,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 19:30'
      },
      {
        'view_time':'19:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592394600,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 19:50'
      },
      {
        'view_time':'20:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592395800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 20:10'
      },
      {
        'view_time':'20:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592397000,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 20:30'
      },
      {
        'view_time':'20:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592398200,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 20:50'
      },
      {
        'view_time':'21:00',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'8.0元配送费',
        'unixtime':1592398800,
        'delivery_time_tip':'',
        'select_view_time':'6月17日(周三) 21:00'
      }],
    [
      {
        'view_time':'07:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592436600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 07:30'
      },
      {
        'view_time':'07:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592437800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 07:50'
      },
      {
        'view_time':'08:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592439000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 08:10'
      },
      {
        'view_time':'08:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592440200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 08:30'
      },
      {
        'view_time':'08:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592441400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 08:50'
      },
      {
        'view_time':'09:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592442600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 09:10'
      },
      {
        'view_time':'09:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592443800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 09:30'
      },
      {
        'view_time':'09:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592445000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 09:50'
      },
      {
        'view_time':'10:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592446200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 10:10'
      },
      {
        'view_time':'10:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592447400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 10:30'
      },
      {
        'view_time':'10:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592448600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 10:50'
      },
      {
        'view_time':'11:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592449800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 11:10'
      },
      {
        'view_time':'11:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592451000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 11:30'
      },
      {
        'view_time':'11:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592452200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 11:50'
      },
      {
        'view_time':'12:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592453400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 12:10'
      },
      {
        'view_time':'12:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592454600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 12:30'
      },
      {
        'view_time':'12:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592455800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 12:50'
      },
      {
        'view_time':'13:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592457000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 13:10'
      },
      {
        'view_time':'13:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592458200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 13:30'
      },
      {
        'view_time':'13:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592459400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 13:50'
      },
      {
        'view_time':'14:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592460600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 14:10'
      },
      {
        'view_time':'14:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592461800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 14:30'
      },
      {
        'view_time':'14:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592463000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 14:50'
      },
      {
        'view_time':'15:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592464200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 15:10'
      },
      {
        'view_time':'15:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592465400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 15:30'
      },
      {
        'view_time':'15:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592466600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 15:50'
      },
      {
        'view_time':'16:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592467800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 16:10'
      },
      {
        'view_time':'16:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592469000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 16:30'
      },
      {
        'view_time':'16:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592470200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 16:50'
      },
      {
        'view_time':'17:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592471400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 17:10'
      },
      {
        'view_time':'17:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592472600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 17:30'
      },
      {
        'view_time':'17:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592473800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 17:50'
      },
      {
        'view_time':'18:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592475000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 18:10'
      },
      {
        'view_time':'18:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592476200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 18:30'
      },
      {
        'view_time':'18:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592477400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 18:50'
      },
      {
        'view_time':'19:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592478600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 19:10'
      },
      {
        'view_time':'19:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592479800,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 19:30'
      },
      {
        'view_time':'19:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592481000,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 19:50'
      },
      {
        'view_time':'20:10',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592482200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 20:10'
      },
      {
        'view_time':'20:30',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592483400,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 20:30'
      },
      {
        'view_time':'20:50',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'5.0元配送费',
        'unixtime':1592484600,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 20:50'
      },
      {
        'view_time':'21:00',
        'date_type_tip':'指定时间',
        'view_shipping_fee':'8.0元配送费',
        'unixtime':1592485200,
        'delivery_time_tip':'',
        'select_view_time':'6月18日(周四) 21:00'
      }]]
};

export default arrive;