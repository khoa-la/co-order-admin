enum ProductTypeEnums {
  SINGLE = 'SINGLE',
  EXTRA = 'EXTRA',
  GIFT = 'GIFT',
}

enum OrderStatusEnums {
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

enum OrderTypeEnums {
  NORMAL = 'NORMAL',
  PARTY = 'PARTY',
}

enum WalletTypeEnums {
  CASH = 'CASH',
}

enum PaymentMethodEnums {
  CASH = 'CASH',
  WALLET = 'WALLET',
  CREDIT = 'CREDIT',
  MOMO = 'MOMO',
  VN_PAY = 'VN_PAY',
  PAYPAL = 'PAYPAL',
}

enum PaymentSatusEnums {
  FINISHED = 'FINISHED',
}

enum RoleEnums {
  CUSTOMER = 1,
  STAFF = 2,
  ADMIN = 3,
}

enum MenuDateFilterEnums {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

enum MenuHourFilterEnums {
  BREAKFAST = 'BREAKFAST',
  BRUNCH = 'BRUNCH',
  LUNCH = 'LUNCH',
  TEA = 'TEA',
  DINNER = 'DINNER',
}

enum MenuTypeEnums {
  NORMAL = 'NORMAL',
}

export const ListProductTypeEnums = [
  {
    id: 1,
    name: ProductTypeEnums.SINGLE,
  },
  {
    id: 2,
    name: ProductTypeEnums.EXTRA,
  },
  {
    id: 3,
    name: ProductTypeEnums.GIFT,
  },
];

export const ListMenuDateFilterEnums = [
  {
    id: 1,
    name: MenuDateFilterEnums.MONDAY,
  },
  {
    id: 2,
    name: MenuDateFilterEnums.TUESDAY,
  },
  {
    id: 3,
    name: MenuDateFilterEnums.WEDNESDAY,
  },
  {
    id: 4,
    name: MenuDateFilterEnums.THURSDAY,
  },
  {
    id: 5,
    name: MenuDateFilterEnums.FRIDAY,
  },
  {
    id: 6,
    name: MenuDateFilterEnums.SATURDAY,
  },
  {
    id: 7,
    name: MenuDateFilterEnums.SUNDAY,
  },
];

export const ListMenuHourFilterEnums = [
  {
    id: 1,
    name: MenuHourFilterEnums.BREAKFAST,
  },
  {
    id: 2,
    name: MenuHourFilterEnums.BRUNCH,
  },
  {
    id: 3,
    name: MenuHourFilterEnums.LUNCH,
  },
  {
    id: 4,
    name: MenuHourFilterEnums.TEA,
  },
  {
    id: 5,
    name: MenuHourFilterEnums.DINNER,
  },
];

export const ListMenuTypeEnums = [
  {
    id: 1,
    name: MenuTypeEnums.NORMAL,
  },
];
