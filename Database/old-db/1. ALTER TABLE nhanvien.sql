ALTER TABLE nhanvien
MODIFY COLUMN `password` varchar(255);

UPDATE nhanvien
Set `password` = '$2a$08$7qu5yXwUv9dDh86qknEwp.3CFEX2HSo57Ty4DctVEybixb5QOVhPW'
Where `id` = 1;

UPDATE nhanvien
Set `password` = '$2a$08$wl.7xPXC9DONZkx3yKh7Kucw/IxvdfTpIQ7X/k8BZ8FCdl15TgMw2'
Where `id` = 2;

UPDATE nhanvien
Set `password` = '$2a$08$UdvGoNkvurR7ZjgmqzRqreKI2n6bUvOJKJxuxApUyhKtFO3k4eRR.'
Where `id` = 3;

