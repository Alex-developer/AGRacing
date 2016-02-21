#include <TM1638.h>
#include <IOexp.h>
#include <Wire.h>

// http://www.nxp.com/documents/data_sheet/PCF8574_PCF8574A.pdf
// https://bitbucket.org/jae686/ioexp
// http://docs-europe.electrocomponents.com/webdocs/0908/0900766b80908ac8.pdf
// https://github.com/rjbatista/tm1638-library

TM1638 primary(8, 7, 9);
TM1638 secondary(8, 7, 10);

word leds [17] = {0, 256, 768, 1792, 3840, 7936, 16128, 32512, 65280, 1, 3, 7, 15, 31, 63, 127, 255};

byte buttons, oldbuttons, page, gameCode;
byte gear, spd, shift, rpm_h = 0, rpm_l = 0, pitlimiter;
byte oldGear;

int fuel;
word rpm = 0;
boolean changed, blinkrpm;
unsigned long milstart, milstart2 = 0;
int brightness = 2;

int pageDelay = 750;
int keyPressDeley = 250;

#define IO_ADDR1 (0x3a)
#define IO_ADDR2 (0x3c)

IOexp gearDisplay(IO_ADDR1);
IOexp ledsDisplay(IO_ADDR2);

int patgears[9][7] = {
  {1, 0, 0, 0, 1, 0, 0},
  {1, 0, 0, 0, 1, 0, 1},
  {0, 0, 0, 1, 0, 0, 1},
  {1, 0, 1, 1, 1, 1, 0},
  {1, 0, 1, 1, 0, 1, 1},
  {1, 1, 0, 1, 0, 0, 1},
  {1, 1, 1, 0, 0, 1, 1},
  {1, 1, 1, 0, 1, 1, 1},
  {0, 0, 1, 1, 0, 0, 1}
};

unsigned long lastButtonPress = 0;
bool processButtons = false;

void setup() {
  Wire.begin();
  Serial.begin(19200);

  primary.setupDisplay(true, brightness);
  secondary.setupDisplay(true, brightness);

  oldbuttons = 0;
  page = 0;
  changed = false;
  blinkrpm = false;

  primary.clearDisplay();
  secondary.clearDisplay();

  primary.setDisplayToString("AGRacing", 0, 0);
  secondary.setDisplayToString("Ready...", 0, 0);
  ledsDisplay.write(P0, true);
  ledsDisplay.write(P1, true);

}

void loop() {
  processPressedButtons();
  readSerialData();
  displayGear();
  updateDisplay();
}

bool readSerialData() {
  bool result = false;

  if (Serial.available() > 0) {
    if (Serial.available() > 8) {
      if (Serial.read() == 255) {
        gameCode = Serial.read();
        gear = Serial.read();
        spd = Serial.read();
        rpm_h = Serial.read();
        rpm_l = Serial.read();
        fuel = Serial.read();
        shift = Serial.read();
        pitlimiter = Serial.read();

        rpm = (rpm_h << 8) | rpm_l;
        result = true;
      }
    }
  }
  return result;
}

void updateDisplay() {
  updateRPMLEDs();
  if (changed) {
    if ((millis() - milstart) > pageDelay) {
      changed = false;
      primary.clearDisplay();
    }
  } else {
    switch (page) {
      case 8:
        if (gear == 0) {
          primary.setDisplayToString("r", 0, 0);
        } else if (gear == 1) {
          primary.setDisplayToString("n", 0, 0);
        } else {
          primary.setDisplayToString(String(gear - 1, DEC), 0, 0);
        }

        if (spd < 100)
          primary.clearDisplayDigit(7, false);
        primary.setDisplayToString(String(spd, DEC), 0, 5);
        break;
      case 16:
        primary.setDisplayToDecNumber(rpm, 0, false);
        break;
      case 32:
        String fuelstr = String(fuel, DEC);
        primary.setDisplayToString(String(fuelstr + " pct"), 0, 0);
        break;
    }
  }
}

void updateRPMLEDs() {
  if ((pitlimiter) == 0) {
    if (shift == 16) {
      ledsDisplay.write(P1, false);
      if ((millis() - milstart2) > 50) {
        if (blinkrpm == false) {
          primary.setLEDs(0x0000);
          blinkrpm = true;
        } else {
          primary.setLEDs(leds[shift]);
          blinkrpm = false;
        }
        milstart2 = millis();
      }
    } else {
      ledsDisplay.write(P1, true);
      primary.setLEDs(leds[shift]);
    }
  } else {
    if ((millis() - milstart2) > 200) {
      if (blinkrpm == false) {
        primary.setLEDs(0x0000);
        blinkrpm = true;
      } else {
        primary.setLEDs(0xFF00);
        blinkrpm = false;
      }
      milstart2 = millis();
    }
  }
}

void processPressedButtons() {

  buttons = primary.getButtons();
  if (buttons != 0) {

    processButtons = false;
    if (lastButtonPress != 0) {
      if ((millis() - lastButtonPress) > keyPressDeley) {
        processButtons = true;
      }
    } else {
      processButtons = true;
    }

    if (processButtons) {
      if (buttons == 1 || buttons == 2) {
        processBrightness(buttons);
      } else {
        if (buttons != oldbuttons) {
          processPage(buttons);
        }
      }
      oldbuttons = buttons;
      lastButtonPress = millis();
    }
  }
}

void processPage(byte buttons) {
  page = buttons;
  primary.clearDisplay();

  switch (page) {
    case 8:
      primary.setDisplayToString("Gear spd", 0, 0);
      break;
    case 16:
      primary.setDisplayToString("Engine", 0, 0);
      break;
    case 32:
      primary.setDisplayToString("Fuel pct", 0, 0);
      break;
  }
  changed = true;
  milstart = millis();
}

void processBrightness(byte buttons) {
  switch (buttons) {
    case 1:
      brightness++;
      if (brightness > 8) {
        brightness = 8;
      }

      break;
    case 2:
      brightness--;
      if (brightness < 0) {
        brightness = 0;
      }
      break;
  }
  primary.setupDisplay(true, brightness);
  secondary.setupDisplay(true, brightness);
}

int powint(int base, int expo) {
  if (expo == 0)
    return (1);
  else
    return (1 << expo);
}

void displayGear() {

  if (gear != oldGear) {
    switch (gear) {
      case 0:
        showGear(0);
        break;
      case 1:
        showGear(1);
        break;
      default:
        showGear(gear);
        break;
    }
    oldGear = gear;
  }
}

void showGear(int gear) {
  unsigned int porta;

  for (int i = 1; i < 8; i++) {
    porta = powint(2, i);
    gearDisplay.write(porta, patgears[gear][i - 1]);
  }
}
