<template>
  <div v-if="hardware?.customised" class="customised">
    <p>
      This hardware configuration has been customised.
      This can be safely ignored if this is a custom hardware build or for testing purposes.
    </p>
    <p>
      You can <a href="/hardware.json">download</a> the configuration
      or <a href="#" @click="reset">reset</a> to pre-configured defaults and reboot.
    </p>
  </div>

  <div v-if="hardware" class="hardware">
    <Section title="CRSF Serial Pins">
      <DigitalInput v-model="hardware.serial_rx"
        label="RX Pin"
        description="Pin used to receive CRSF signal from the handset"
      />
      <DigitalOutput v-model="hardware.serial_tx"
        label="TX Pin"
        description="Pin used to transmit CRSF telemetry to the handset (may be the same as the RX PIN)"
      />
    </Section>

    <Section title="Radio Chip Pins & Options">
      <DigitalInput v-model="hardware.radio_busy"
        label="BUSY pin"
        description="GPIO Input connected to SX128x busy pin"
      />
      <DigitalInput v-model="hardware.radio_dio0"
        label="DIO0 pin"
        description="Unused on SX128x, Interrupt pin for SX127x"
      />
      <DigitalInput v-model="hardware.radio_dio1"
        label="DIO1 pin"
        description="Interrupt pin for SX128x"
      />
      <DigitalInput v-model="hardware.radio_dio2"
        label="DIO2 pin"
        description="Unused on SX128x and 127x"
      />
      <DigitalInput v-model="hardware.radio_miso"
        label="MISO pin"
        description="MISO connected to (possibly) multiple SX1280/127x"
      />
      <DigitalOutput v-model="hardware.radio_mosi"
        label="MOSI pin"
        description="MOSI connected to (possibly) multiple SX1280/127x"
      />
      <DigitalOutput v-model="hardware.radio_nss"
        label="NSS pin"
        description="Chip select pin for first SX1280/127x"
      />
      <DigitalOutput v-model="hardware.radio_rst"
        label="RST pin"
        description="Reset pin connected to (possibly) multiple SX1280/127x"
      />
      <DigitalOutput v-model="hardware.radio_sck"
        label="SCK pin"
        description="Clock pin connected to (possibly) multiple SX1280/127x"
      />
      <DigitalInput v-model="hardware.radio_busy_2"
        label="BUSY_2 pin"
        description="Busy pin for second SX1280"
      />
      <DigitalInput v-model="hardware.radio_dio0_2"
        label="DIO0_2 pin"
        description="Interrupt pin for second SX127x"
      />
      <DigitalInput v-model="hardware.radio_dio1_2"
        label="DIO1_2 pin"
        description="Interrupt pin for second SX1280"
      />
      <DigitalOutput v-model="hardware.radio_nss_2"
        label="NSS_2 pin"
        description="Chip select pin for second SX1280"
      />
      <DigitalOutput v-model="hardware.radio_rst_2"
        label="RST_2 pin"
        description="Reset pin connected to second SX1280/127x"
      />
      <Checkbox v-model="hardware.radio_dcdc"
        label="DCDC enabled"
        description="Use the SX1280 DC-DC converter rather than LDO voltage regulator (15uH inductor must be present)"
      />
      <Checkbox v-model="hardware.radio_rfo_hf"
        label="RFO_HF enabled"
        description="SX127x PA to use, either the RFO_HF or PA_BOOST (depends on circuit design)"
      />
    </Section>

    <Section title="Radio Antenna">
      <DigitalOutput v-model="hardware.ant_ctrl"
        label="CTRL pin"
        description="Pin connected to Antenna select pin on power amplifier"
      />
      <DigitalOutput v-model="hardware.ant_ctrl_compl"
        label="CTRL_COMPL pin"
        description="Inverted CTRL for devices using antenna selectors that need separate pins for A/B selection"
      />
    </Section>

    <Section title="Radio Power">
      <DigitalOutput v-model="hardware.power_enable"
        label="PA enable pin"
        description="Enable the power amplifier (active high)"
      />
      <DigitalOutput v-model="hardware.power_apc1"
        label="APC1 pin"
        description="Power amplifier control voltage"
      />
      <DigitalOutput v-model="hardware.power_apc2"
        label="APC2 pin"
        description="Power amplifier control voltage"
      />
      <DigitalOutput v-model="hardware.power_rxen"
        label="RXEN pin"
        description="Enable RX mode LNA (active high)"
      />
      <DigitalOutput v-model="hardware.power_txen"
        label="TXEN pin"
        description="Enable TX mode PA (active high)"
      />
      <DigitalOutput v-model="hardware.power_rxen_2"
        label="RXEN_2 pin"
        description="Enable RX mode LNA on second SX1280 (active high)"
      />
      <DigitalOutput v-model="hardware.power_txen_2"
        label="TXEN_2 pin"
        description="Enable TX mode PA on second SX1280 (active high)"
      />
      <PowerSelect v-model="hardware.power_min"
        label="Min Power"
        description="Minimum selectable power output"
      />
      <PowerSelect v-model="hardware.power_high"
        label="High Power"
        description="Highest selectable power output (if option for higher power is NOT enabled)"
      />
      <PowerSelect v-model="hardware.power_max"
        label="Max Power"
        description="Absolute maximum selectable power output (only available if 'higher power' option is enabled)"
      />
      <PowerSelect v-model="hardware.power_default"
        label="Default Power"
        description="Default power output when resetting or first flashing a module"
      />
      <PowerLevelControlSelect v-model="hardware.power_control"
        label="Power Level control"
        description="How the power level is set"
      />
      <ArrayInput v-model="hardware.power_values"
        label="Power Value(s)"
        description="Comma-separated list of values that set the power output (if using a DAC these are the DAC values)"
      />
      <ArrayInput v-model="hardware.power_values2"
        label="Secondary Power Value(s)"
        description="
          Comma-separated list of values that set the power output (if using a DAC then these set the Semtech power output)
        "
      />
      <ArrayInput v-model="hardware.power_values_dual"
        label="Dual Power Value(s)"
        description="Comma-separated list of values that set the higher frequency power output of a dual band Tx/Rx"
      />
    </Section>

    <Section title="Radio Power Detection">
      <AnalogInput v-model="hardware.power_pdet"
        label="PDET pin"
        description="Analog input (up to 1.1V) connected to 'power detect' pin on PA for adjustment of the power output"
      />
      <TextInput v-model="hardware.power_pdet_intercept"
        :size="20"
        label="Intercept"
        description="Intercept and Slope are used together to calculate the dBm from the measured mV on the PDET pin"
      />
      <TextInput v-model="hardware.power_pdet_slope"
        :size="20"
        label="Slope"
        description="dBm = mV * slope + intercept, this is then used to adjust the actual output power accordingly"
      />
    </Section>

    <Section v-if="isTX" name="Analog Joystick">
      <AnalogInput v-model="hardware.joystick"
        label="ADC pin"
        description="Analog Input (3.3V max) use to read joystick direction using a resistor network"
      />
      <ArrayInput v-model="hardware.joystick_values"
        label="Values"
        description="Comma-separated list of ADC values (12-bit) for UP, DOWN, LEFT, RIGHT, ENTER, IDLE"
      />
    </Section>

    <Section v-if="isTX" name="Digital Joystick">
      <DigitalInput v-model="hardware.five_way1"
        label="Pin 1"
        description="These 3 pins create a binary value for the joystick direction"
      />
      <DigitalInput v-model="hardware.five_way2"
        label="Pin 2"
        description="7 = IDLE, 6 = OK, 5 = DOWN"
      />
      <DigitalInput v-model="hardware.five_way3"
        label="Pin 3"
        description="4 = RIGHT, 3 = UP, 2 = LEFT"
      />
    </Section>

    <Section title="Mood Lighting">
      <DigitalOutput v-model="hardware.led_rgb"
        label="RGB LED pin"
        description="Signal pin for WS2812 RGB LED or LED strip"
      />
      <Checkbox v-model="hardware.led_rgb_isgrb"
        label="RGB LED is GRB"
        description="Most WS2812 RGB LEDs are actually GRB"
      />
      <ArrayInput v-model="hardware.ledidx_rgb_status"
        label="RGB indexes for Status"
        description="Indexes into the 'string' of RGB LEDs (if empty then only LED at 0 is used)"
      />
      <ArrayInput v-if="isRX" v-model="hardware.ledidx_rgb_vtx"
        label="RGB indexes for VTX Status"
        description="Indexes into the 'string' of RGB LEDs (if empty then no VTX status)"
      />
      <ArrayInput v-model="hardware.ledidx_rgb_boot"
        label="RGB indexes for Boot animation"
        description="Indexes into the 'string' of RGB LEDs (if empty status indexes are used)"
      />
      <DigitalOutput v-model="hardware.led"
        label="LED pin"
        description="Only use when only a single LED is used"
      />
      <DigitalOutput v-model="hardware.led_red"
        label="Red LED pin"
        description="If there are multiple LEDs, then this is the pin for the RED LED"
      />
      <Checkbox v-model="hardware.led_red_invert"
        label="Red LED inverted"
        description="LEDs are active LOW unless this is checked"
      />
      <DigitalOutput v-model="hardware.led_green"
        label="Green LED pin"
        description="If there is a GREEN LED as well as RED above"
      />
      <Checkbox v-model="hardware.led_green_invert"
        label="Green LED inverted"
        description="Check if the LED is active HIGH"
      />
      <DigitalOutput v-model="hardware.led_blue"
        label="Blue LED pin"
        description="Pin for a 3rd, BLUE, LED!"
      />
      <Checkbox v-model="hardware.led_blue_invert"
        label="Blue LED inverted"
        description="Check if the LED is active HIGH"
      />
    </Section>

    <Section title="Buttons">
      <DigitalOutput v-model="hardware.button"
        label="Button 1 pin"
        description="Single/first (active low) button"
      />
      <TextInput v-model="hardware.button_led_index"
        :size="3"
        label="Button 1 RGB Index"
        description="Index of button LED in RGB string, leave empty for no RGB LED"
      />
      <DigitalOutput v-model="hardware.button2"
        label="Button 2 pin"
        description="Second (active low) button"
      />
      <TextInput v-model="hardware.button2_led_index"
        :size="3"
        label="Button 2 RGB Index"
        description="Index of button LED in RGB string, leave empty for no RGB LED"
      />
    </Section>

    <Section v-if="isTX" name="OLED/TFT (Crotch TV)">
      <ScreenTypeSelect v-model="hardware.screen_type"
        label="Screen type"
        description="Type of OLED connected"
      />
      <Checkbox v-model="hardware.screen_reversed"
        label="180 rotation"
        description="Select to rotate the display 180 degrees"
      />
      <DigitalInput v-model="hardware.screen_cs"
        label="CS pin"
        description="Chip Select (if using SPI)"
      />
      <DigitalInput v-model="hardware.screen_dc"
        label="DC pin"
        description="Data/Command Select (if using SPI)"
      />
      <DigitalInput v-model="hardware.screen_mosi"
        label="MOSI pin"
        description="Data (if using SPI)"
      />
      <DigitalInput v-model="hardware.screen_rst"
        label="RST pin"
        description="Reset"
      />
      <DigitalInput v-model="hardware.screen_sck"
        label="SCK pin"
        description="Clock (either SPI or I2C)"
      />
      <DigitalInputOutput v-model="hardware.screen_sda"
        label="SDA pin"
        description="Data (I2C)"
      />
      <DigitalInput v-model="hardware.screen_bl"
        label="BL pin"
        description="Backlight"
      />
    </Section>

    <Section title="Backpack / Logging">
      <Checkbox v-model="hardware.use_backpack"
        label="Enable Backpack"
        description="If a TX backpack is connected"
      />
      <NumberInput v-model="hardware.debug_backpack_baud"
        :size="10"
        label="Baud Rate"
        description="Baud rate used to communicate to the backpack (normally 460800)"
      />
      <DigitalInput v-model="hardware.debug_backpack_rx"
        label="RX pin"
        description="Connected to TX pin on backpack"
      />
      <DigitalOutput v-model="hardware.debug_backpack_tx"
        label="TX pin"
        description="Connected to RX pin on backpack"
      />
      <DigitalOutput v-model="hardware.backpack_boot"
        label="BOOT pin"
        description="Pin connected to GPIO0 pin on backpack ESP8285, allows passthrough flashing"
      />
      <DigitalOutput v-model="hardware.backpack_en"
        label="EN pin"
        description="Pin connected to EN pin on backpack ESP8285, allows passthrough flashing"
      />
      <NumberInput v-model="hardware.passthrough_baud"
        :size="7"
        label="Passthrough baud"
        description="Baud rate to flash the backpack ESP8285 (default is to use the baud rate above)"
      />
    </Section>

    <Section title="I2C & Misc Devices">
      <DigitalOutput v-model="hardware.i2c_scl"
        label="SCL pin"
        description="I2C clock pin used to communicate with I2C devices (may be the same as OLED I2C)"
      />
      <DigitalInputOutput v-model="hardware.i2c_sda"
        label="SDA pin"
        description="I2C data pin used to communicate with I2C devices (may be the same as OLED I2C)"
      />
      <DigitalOutput v-model="hardware.misc_fan_en"
        label="Fan enable pin"
        description="Pin used to enable a cooling FAN (active HIGH)"
      />
      <PwmOutput v-model="hardware.misc_fan_pwm"
        label="Fan PWM pin"
        description="If the fan is controlled by PWM"
      />
      <ArrayInput v-model="hardware.misc_fan_speeds"
        label="Fan PWM output values"
        description="
          If the fan is PWM controlled, then this is the list of values for the PWM output for the matching power output levels
        "
      />
      <DigitalInput v-model="hardware.misc_fan_tacho"
        label="Fan TACHO pin"
        description="If the fan has a 'tachometer' interrupt pin"
      />
      <Checkbox v-model="hardware.gsensor_stk8xxx"
        label="Has STK8xxx G-sensor"
        description="Checked if there is a STK8xxx g-sensor on the I2C bus"
      />
      <DigitalInput v-model="hardware.misc_gsensor_int"
        label="G-sensor interrupt pin"
        description="Pin connected the STK8xxx g-sensor for interrupts"
      />
      <Checkbox v-model="hardware.thermal_lm75a"
        label="Has LM75A Thermal sensor"
        description="Checked if there is a LM75A thermal sensor on the I2C bus"
      />
    </Section>

    <Section v-if="isRX" name="PWM">
      <PwmArrayInput v-model="hardware.pwm_outputs"
        label="PWM output pins"
        description="Comma-separated list of pins used for PWM output"
      />
    </Section>

    <Section v-if="isRX" name="VBat">
      <AnalogInput v-model="hardware.vbat"
        label="VBat pin"
        description="Analog input pin for reading VBAT voltage (1V max on 8285, 3.3V max on ESP32)"
      />
      <TextInput v-model="hardware.vbat_offset"
        :size="7"
        label="VBat offset"
        description="Offset and scale are used together with the analog pin to calculate the voltage"
      />
      <TextInput v-model="hardware.vbat_scale"
        :size="7"
        label="VBat scale"
        description="voltage = (analog - offset) / scale"
      />
      <VBatAttenuationSelect v-model="hardware.vbat_atten"
        label="VBat attenuation"
        description="ADC pin attenuation (ESP32) and optional efuse-based calibration adjustment"
      />
    </Section>

    <Section v-if="isRX" name="SPI VTX">
      <PwmOutput v-model="hardware.vtx_amp_pwm"
        label="RF amp PWM pin"
        description="
          Set the power output level of the VTX PA (value is calculated based on power and frequency using
          VPD interpolation values)
        "
      />
      <AnalogInput v-model="hardware.vtx_amp_vpd"
        label="RF amp VPD pin"
        description="Analog input for VPD (power detect) from VTX PA"
      />
      <DigitalOutput v-model="hardware.vtx_amp_vref"
        label="RF amp VREF pin"
        description="Active high enable pin the the VTX PA VREF (voltage reference)"
      />
      <DigitalOutput v-model="hardware.vtx_nss"
        label="SPI NSS pin"
        description="Chip select for RTC6705 VTx (leave undefined if sharing Radio SPI bus)"
      />
      <DigitalOutput v-model="hardware.vtx_sck"
        label="SPI SCK pin"
        description="Clock pin on RTC6705 VTx (leave undefined if sharing Radio SPI bus)"
      />
      <DigitalInput v-model="hardware.vtx_miso"
        label="SPI MISO pin"
        description="MISO pin on RTC6705 VTx (leave undefined if sharing Radio SPI bus)"
      />
      <DigitalOutput v-model="hardware.vtx_mosi"
        label="SPI MOSI pin"
        description="MOSI pin on RTC6705 VTx (leave undefined if sharing Radio SPI bus)"
      />
      <ArrayInput v-model="hardware.vtx_amp_vpd_25mW"
        label="25mW VPD interpolation values"
        description="4 values for 5650, 5750, 5850, 5950 frequencies at 25mW"
      />
      <ArrayInput v-model="hardware.vtx_amp_vpd_100mW"
        label="100mW VPD interpolation values"
        description="4 values for 5650, 5750, 5850, 5950 frequencies at 100mW"
      />
      <ArrayInput v-model="hardware.vtx_amp_pwm_25mW"
        label="25mW PWM interpolation values"
        description="4 values for 5650, 5750, 5850, 5950 frequencies at 25mW"
      />
      <ArrayInput v-model="hardware.vtx_amp_pwm_100mW"
        label="100mW PWM interpolation values"
        description="4 values for 5650, 5750, 5850, 5950 frequencies at 100mW"
      />
    </Section>

    <Section v-if="isRX" name="I2C">
      <DigitalOutput v-model="hardware.i2c_scl"
        label="SCL pin"
        description="I2C clock pin used to communicate with I2C devices"
      />
      <DigitalInput v-model="hardware.i2c_sda"
        label="SDA pin"
        description="I2C data pin used to communicate with I2C devices"
      />
    </Section>

    <Actions>
      <Button @click="save">Save target configuration</Button>
      <Button type="tertiary" @click="reset">Reset target configuration</Button>
    </Actions>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import Section from './hardware/Section.vue'
import AnalogInput from './hardware/AnalogInput.vue'
import DigitalInput from './hardware/DigitalInput.vue'
import DigitalOutput from './hardware/DigitalOutput.vue'
import DigitalInputOutput from './hardware/DigitalInputOutput.vue'
import Checkbox from './hardware/Checkbox.vue'
import ArrayInput from './hardware/ArrayInput.vue'
import TextInput from './hardware/TextInput.vue'
import NumberInput from './hardware/NumberInput.vue'
import PwmOutput from './hardware/PwmOutput.vue'
import PwmArrayInput from './hardware/PwmArrayInput.vue'
import PowerSelect from './hardware/PowerSelect.vue'
import ScreenTypeSelect from './hardware/ScreenTypeSelect.vue'
import PowerLevelControlSelect from './hardware/PowerLevelControlSelect.vue'
import VBatAttenuationSelect from './hardware/VBatAttenuationSelect.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'

import { useTarget } from '@/composables/target'
import { useHardware } from '@/composables/hardware'
import { useAlert } from '@/composables/alert'

const { reboot } = useTarget()
const { hardware, load, save: saveHardware, reset: resetHardware } = useHardware()
const { isTX, isRX } = useTarget()
const { question, info, error } = useAlert()

onMounted(load)

async function save() {
  if (await saveHardware()) {
    if (await question('Upload Succeeded', 'Reboot to take effect', 'Reboot', 'Cancel') !== 'cancel') {
      reboot()
    }
  } else {
    error('Upload Failed', 'Check your connection to the module')
  }
}

async function reset() {
  if (await resetHardware()) {
    info('Reset Hardware Options', 'Reset complete, rebooting...')
  } else {
    error('Reset Hardware Options', 'An error occurred resetting hardware options')
  }
}
</script>

<style lang="postcss" scoped>
.hardware {
  display: grid;
  row-gap: 0.5rem;
  grid-template-columns: max-content max-content max-content 1fr;
  margin-top: 16px;
}

.customised {
  background-color: var(--clr-danger);
  grid-column: span 1 / -1;
  padding: 16px;
}
</style>
