&nbsp;                           **INSTALLATION GUIDE FOR UBUNTU**



1. sudo apt update



2. sudo apt install build-essential cmake git libssl-dev pkg-config



3. git clone --recursive https://github.com/open-quantum-safe/liboqs.git



4. cd liboqs



5. mkdir build \&\& cd build



6. cmake -DCMAKE\_BUILD\_TYPE=Release ..



7. make -j$(nproc)



8. sudo make install







