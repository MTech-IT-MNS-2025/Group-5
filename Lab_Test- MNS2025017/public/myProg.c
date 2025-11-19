#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

uint64_t modexp(uint64_t a, uint64_t b, uint64_t n) {
    uint64_t result = 1;
    a = a % n;  // reduce 'a' first

    while (b > 0) {
        if (b & 1) {              // if b is odd
            result = (result * a) % n;
        }
        a = (a * a) % n;          // square base
        b >>= 1;                  // divide b by 2
    }

    return result;
}

// Browser + server dono ke liye common function
uint64_t compute(uint64_t a, uint64_t b, uint64_t n) {
    return modexp(a, b, n);
}

#ifndef EMSCRIPTEN
// Ye main sirf SERVER EXECUTABLE ke liye hai, WASM ke liye nahi
int main(int argc, char **argv) {
    if (argc < 4) {
        fprintf(stderr, "Usage: %s a b n\n", argv[0]);
        return 1;
    }

    uint64_t a = strtoull(argv[1], NULL, 10);
    uint64_t b = strtoull(argv[2], NULL, 10);
    uint64_t n = strtoull(argv[3], NULL, 10);

    uint64_t res = compute(a, b, n);

    printf("%llu\n", (unsigned long long)res);
    return 0;
}
#endif

