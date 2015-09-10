/**
 * Created by Ihor on 10.09.2015.
 */
$(document).ready(function (){
    $('body').css({
        minHeight: window.innerHeight
    });
    $('#selectBg').on('change',function (){
        if(this.value ==  2){
            $('body').addClass('bg_'+2);
        } else {
            $('body').removeClass('bg_'+2);
        }
    });
    $('#selectOpacity').on('change',function (){
        $('canvas').css({
            opacity: $(this).val() == 10 ? 1 : '0.'+$(this).val()
        });
    });
});