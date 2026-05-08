package expo.modules.expoandroidtts

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.util.Locale
import java.util.UUID

class ExpoAndroidTtsModule : Module() {
  private var tts: TextToSpeech? = null
  private var isReady = false
  private val pendingPromises = mutableMapOf<String, Promise>()
  private var currentPitch = 1.0f
  private var currentRate = 1.0f

  override fun definition() = ModuleDefinition {
    Name("ExpoAndroidTts")

    AsyncFunction("synthesizeToFile") { text: String, outputPath: String, promise: Promise ->
      if (!isReady) {
        promise.reject("TTS_NOT_READY", "TTS engine not initialized", null)
        return@AsyncFunction
      }

      try {
        val file = File(outputPath)
        file.parentFile?.mkdirs()

        val utteranceId = UUID.randomUUID().toString()
        pendingPromises[utteranceId] = promise

        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
          override fun onDone(uid: String?) {
            uid?.let {
              pendingPromises.remove(it)?.resolve(outputPath)
            }
          }

          override fun onError(uid: String?) {
            uid?.let {
              pendingPromises.remove(it)?.reject("TTS_ERROR", "Failed to synthesize text", null)
            }
          }

          override fun onStart(uid: String?) {}
        })

        val result = tts?.synthesizeToFile(text, null, file, utteranceId)
        if (result != TextToSpeech.SUCCESS) {
          promise.reject("TTS_ERROR", "synthesizeToFile returned $result", null)
        }
      } catch (e: Exception) {
        promise.reject("TTS_ERROR", e.message ?: "Unknown error", e)
      }
    }

    AsyncFunction("setLanguage") { locale: String, promise: Promise ->
      val loc = when (locale.lowercase()) {
        "zh" -> Locale.CHINESE
        "en" -> Locale.ENGLISH
        "ja" -> Locale.JAPANESE
        "ko" -> Locale.KOREAN
        else -> Locale.CHINESE
      }
      val result = tts?.setLanguage(loc)
      promise.resolve(result == TextToSpeech.LANG_COUNTRY_AVAILABLE || result == TextToSpeech.LANG_AVAILABLE)
    }

    AsyncFunction("setSpeechRate") { rate: Float, promise: Promise ->
      currentRate = rate
      tts?.setSpeechRate(rate)
      promise.resolve(null)
    }

    AsyncFunction("setPitch") { pitch: Float, promise: Promise ->
      currentPitch = pitch
      tts?.setPitch(pitch)
      promise.resolve(null)
    }

    OnCreate {
      tts = TextToSpeech(appContext.reactContext!!) { status ->
        isReady = status == TextToSpeech.SUCCESS
        if (isReady) {
          tts?.setLanguage(Locale.CHINESE)
          tts?.setSpeechRate(currentRate)
          tts?.setPitch(currentPitch)
        }
      }
    }

    OnDestroy {
      tts?.stop()
      tts?.shutdown()
      tts = null
      isReady = false
      pendingPromises.forEach { (_, p) ->
        p.reject("TTS_DESTROYED", "TTS module destroyed", null)
      }
      pendingPromises.clear()
    }
  }
}
