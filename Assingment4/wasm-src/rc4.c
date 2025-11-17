#include <stdlib.h>
#include <stdint.h>

#define KEY_SIZE 256

uint8_t S[KEY_SIZE];

void ksa(uint8_t *key, int key_len) {
    for (int i = 0; i < KEY_SIZE; i++)
        S[i] = i;

    int j = 0;
    for (int i = 0; i < KEY_SIZE; i++) {
        j = (j + S[i] + key[i % key_len]) % KEY_SIZE;
        uint8_t temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }
}

void rc4(uint8_t *data, int len) {
    int i = 0, j = 0;
    for (int k = 0; k < len; k++) {
        i = (i + 1) % KEY_SIZE;
        j = (j + S[i]) % KEY_SIZE;

        uint8_t temp = S[i];
        S[i] = S[j];
        S[j] = temp;

        uint8_t rnd = S[(S[i] + S[j]) % KEY_SIZE];
        data[k] ^= rnd;
    }
}
