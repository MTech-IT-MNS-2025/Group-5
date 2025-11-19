#include <stdint.h>
#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE
uint64_t modexp(uint64_t a, uint64_t b, uint64_t n) {
    uint64_t result = 1;
    a = a % n;
    while (b > 0) {
        if (b & 1) result = (result * a) % n;
        a = (a * a) % n;
        b >>= 1;
    }
    return result;
}
